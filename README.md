# Kolotoče Janeček — web

Statický web (HTML / CSS / JS) pro pouťové atrakce **Kolotoče Janeček** — _Zábava, která roztáčí radost._

## Struktura

- `index.html` — domovská stránka (hero, o nás, atrakce, co nabízíme, náhled galerie, kontakt)
- `galerie.html` — fotogalerie
- `css/style.css` — styl
- `js/main.js` — mobilní menu, lightbox galerie, animace
- `images/photos/` — webové (optimalizované) fotky
- `images/originals/` — původní fotky (záloha)

## Lokální náhled

Otevři `index.html` přímo v prohlížeči, nebo spusť lokální server:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Nasazení

Web je statický, bez build kroku — nasaditelný kamkoliv (Vercel, Netlify, …).
Na Vercelu se nasadí automaticky při každém pushi do větve `main`.

---

**Kontakt:** atrakce.janecek@seznam.cz · 602 376 505
[Instagram](https://www.instagram.com/kolotoce_janecek) · [Facebook](https://www.facebook.com/share/p/1CrHv5DBgj/)
