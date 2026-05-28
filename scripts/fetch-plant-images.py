"""
Script: fetch-plant-images.py
Otomatis ambil foto akurat dari Wikipedia untuk semua tanaman di plants.json
Cara pakai: python scripts/fetch-plant-images.py
"""
import json, urllib.request, urllib.parse, time, sys

PLANTS_FILE = 'src/data/plants.json'

def get_wiki_image(scientific_name, common_name, plant_id):
    """Coba berbagai query untuk dapatkan foto Wikipedia yang akurat."""
    queries = [
        scientific_name,                          # nama ilmiah (paling akurat)
        scientific_name.split()[0] + ' ' + scientific_name.split()[1] if len(scientific_name.split()) >= 2 else scientific_name,
        common_name,                              # nama umum Indonesia
    ]
    
    for query in queries:
        try:
            encoded = urllib.parse.quote(query.replace(' ', '_'))
            url = f'https://en.wikipedia.org/api/rest_v1/page/summary/{encoded}'
            req = urllib.request.Request(url, headers={
                'User-Agent': 'TanamanKu/1.0 (plant app; yohanesafry34@gmail.com)'
            })
            with urllib.request.urlopen(req, timeout=10) as r:
                data = json.loads(r.read().decode('utf-8'))
            
            if 'thumbnail' in data and 'source' in data['thumbnail']:
                img = data['thumbnail']['source']
                # Paksa ukuran 400px
                for old in ['/320px-', '/200px-', '/150px-', '/100px-', '/50px-']:
                    img = img.replace(old, '/400px-')
                return img, query
        except Exception:
            pass
        time.sleep(0.3)
    
    return None, None

def main():
    with open(PLANTS_FILE, 'r', encoding='utf-8') as f:
        plants = json.load(f)
    
    print(f"Memproses {len(plants)} tanaman...\n")
    updated = 0
    failed = []
    
    for i, plant in enumerate(plants):
        img, matched_query = get_wiki_image(
            plant['scientificName'], 
            plant['name'],
            plant['id']
        )
        
        if img:
            plant['imageUrl'] = img
            updated += 1
            print(f"✅ [{i+1:2}/{len(plants)}] {plant['name']:<25} → {img[:60]}...")
        else:
            failed.append(plant)
            print(f"❌ [{i+1:2}/{len(plants)}] {plant['name']:<25} → tidak ditemukan (pakai foto lama)")
        
        time.sleep(0.4)  # Jeda agar tidak overload Wikipedia API
    
    # Simpan hasil
    with open(PLANTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(plants, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'='*60}")
    print(f"Selesai! {updated}/{len(plants)} foto berhasil diperbarui.")
    
    if failed:
        print(f"\nTidak ditemukan ({len(failed)} tanaman) — perlu foto manual:")
        for p in failed:
            print(f"  - {p['id']}: {p['name']} ({p['scientificName']})")
    
    print(f"\nJangan lupa commit hasilnya:")
    print(f"  git add src/data/plants.json")
    print(f"  git commit -m \"fix: update foto tanaman dari Wikipedia\"")
    print(f"  git push")

if __name__ == '__main__':
    main()
