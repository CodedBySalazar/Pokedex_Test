
# Technical test | Pokemon API

This project is an interactive **Pokedex** that consume data of the public API of Pokemon and shows the Pokemon related of the selected region, the used in this case was: **Kanto**.

It was developed as a part of **technical test** to apply for a **internship position in Midware**. The purpose was to test technical skills in web development using tecnologies as HTML, CSS and JavaScript.

---
## 🎯 Features

- ✅ List and display pokemons of the Kanto region
- ✅ Enter pokemon name or related letters to filter through the list and see related results 
- ✅ Show a pokemon to see details as the sprite, types, egg groups, weight, height and species
- ✅ Show the evolution chain of the pokemon selected
- ✅ Use of styled components with Boostrap

---
## 🛠 Used Technologies

- **HTML5 / CSS3 / JavaScript**
- **Bootstrap v5**
- **Bootstrap Icons**
- **jQuery**
- **Next.js (just to prove functionality, it doesn´t have a key piece in project or direct integrations)**

> [!NOTE]
> All the libraries used in this project were downloaded and included locally, so it doesn't require an internet connection to work.

---
## 📦 Structure of files and folders

```
/ (root)
│
├── views
|   |__ index.html      # Principal page
├── styles
|   |__ styles.css      # Custom styles
├── js 
|   |__ script.js       # Application Logic
│
└── libs/              # Included dependencies
    ├── bootstrap/
    │   ├── css/
    │   ├── js/
    │   └── bootstrap-icons/
    └── jquery/
```

---
## ⚙️ How to run the project

1. Clone the repository
  ```bash
  git clone https://github.com/CodedBySalazar/Pokedex_Test.git
  ```
2. Open the `index.html` file that is inside of **views folder**. Run the file in the browser of your choice. 

> [!IMPORTANT]
> It won't need any local server or adittional instalation. Everything will directly run in the browser.


## 📌 Usage/Examples

>[!TIP]
> After opening `index.html` in your browser:

1. You will see a list of Pokémon from Kanto region.
2. Click on any Pokémon to display its full profile, including:
- Large image
- Name and Type(s)
- Additional info
- Evolutions
3. Use the search bar to filter Pokémon by name in real-time


---

## :bust_in_silhouette: Author

**Kendall Salazar Sbaja**

GitHub: [CodedBySalazar](https://www.github.com/codedbysalazar)

---
## :bulb: Sources
- Pokemon API: [PokéAPI](https://pokeapi.co/)
- Bootstrap: (https://getbootstrap.com/)
- Bootstrap Icons : (https://getbootstrap.com/)
- jQuery : (https://jquery.com/)
