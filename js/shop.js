const articles = {
  video: {
    base: 6000,
    options: {
      "Voix off": 2000,
      "Musique": 500,
      "RTX": 1000,
      "Effect+": 1000,
      "Vous pouvez parler": 1000,
      "4k": 1000,
      "Publication sur Youtube": 500
    },
    durations: {
      "30 sec": 1,
      "1 min": 1.8,
      "2 min": 2.5
    },
    name: "Vidéo"
  },
  short: {
    base: 4000,
    options: {
      "Voix off": 1000,
      "Musique": 250,
      "RTX": 1000,
      "Effect+": 750,
      "Vous pouvez parler": 750,
      "4k": 1000,
      "Publication": 1000
    },
    durations: {
      "30 sec": 1,
      "1 min": 1.8
    },
    name: "Short"
  },
  image: {
    base: 3000,
    options: {
      "RTX": 500,
      "Format personnalisé": 250,
      "Image de fond personnalisé": 1000,
      "Intégration 3D": 2000,
      "4k": 1000,
      "Publication (Insta)": 1000
    },
    durations: {
      "Pack de 1": 1,
      "Pack de 2": 1.5,      
      "Pack de 3": 2
    },
    name: "Image"
  }
};

let currentArticleKey = null;
let currentOptions = {};
let currentDuration = null;
let projectDescription = "";
let cart = [];

function selectArticle(key) {
  currentArticleKey = key;
  currentOptions = {};
  currentDuration = null;
  projectDescription = "";
  document.getElementById("modalTitle").textContent = "Options pour " + articles[key].name;
  document.getElementById("projectDesc").value = "";
  loadOptionsForm(key);
  loadDurations(key);
  goTo("page-options");
}

function loadOptionsForm(key) {
  const form = document.getElementById("optionsForm");
  form.innerHTML = "";
  const opts = articles[key].options;
  // Optionnel : images pour chaque option (sinon une image par défaut)
  const optionImages = {
    "Voix off": "https://cdn-icons-png.flaticon.com/512/727/727245.png",
    "Musique": "https://cdn-icons-png.flaticon.com/512/727/727218.png",
    "RTX": "https://cdn-icons-png.flaticon.com/512/727/727240.png",
    "Images": "https://cdn-icons-png.flaticon.com/512/727/727234.png",
    "Vous pouvez parler": "https://cdn-icons-png.flaticon.com/512/727/727206.png",
    "4k": "https://cdn-icons-png.flaticon.com/512/727/727232.png",
    "Publication sur Youtube": "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
    "Publication": "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
    "Format personnalisé": "https://cdn-icons-png.flaticon.com/512/727/727204.png",
    "Image de fond personnalisé": "https://cdn-icons-png.flaticon.com/512/727/727234.png",
    "Intégration 3D": "https://cdn-icons-png.flaticon.com/512/727/727239.png",
    "Publication (Insta)": "https://cdn-icons-png.flaticon.com/512/1384/1384063.png"
  };
  // Optionnel : descriptions pour chaque option
  const optionDescs = {
    "Voix off": "Ajoute une narration professionnelle.",
    "Musique": "Inclut une musique de fond adaptée.",
    "RTX": "Effets graphiques avancés (RTX).",
    "Images": "Ajoute des images personnalisées.",
    "Vous pouvez parler": "Vous intervenez dans la vidéo.",
    "4k": "Qualité vidéo 4K Ultra HD.",
    "Publication sur Youtube": "Publication directe sur YouTube.",
    "Publication": "Publication sur la plateforme choisie.",
    "Format personnalisé": "Format d'image sur-mesure.",
    "Image de fond personnalisé": "Fond d'image personnalisé.",
    "Intégration 3D": "Ajoute des éléments 3D.",
    "Publication (Insta)": "Publication sur Instagram."
  };
  Object.keys(opts).forEach(option => {
    const price = opts[option];
    const img = optionImages[option] || "https://cdn-icons-png.flaticon.com/512/727/727245.png";
    const desc = optionDescs[option] || "";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "shop-option-btn";
    btn.innerHTML = `
      <img class="option-img" src="${img}" alt="${option}">
      <div class="option-title">${option}</div>
      <div class="option-desc">${desc}</div>
      <div class="option-price">+${price} $</div>
      <div class="option-check">✔️</div>
    `;
    btn.onclick = function() {
      btn.classList.toggle("selected");
    };
    form.appendChild(btn);
  });
}

function loadDurations(key) {
  const grid = document.getElementById("durationOptions");
  const select = document.getElementById("durationSelect");
  if (!grid || !select) return;
  grid.innerHTML = "";
  select.innerHTML = "";
  const durations = articles[key].durations;
  let first = true;
  Object.keys(durations).forEach(dur => {
    const price = durations[dur];
    // Ajoute l'option au select caché
    const opt = document.createElement("option");
    opt.value = dur;
    opt.textContent = dur;
    select.appendChild(opt);

    // Crée le bouton visuel
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "shop-duration-btn";
    btn.innerHTML = `
      <div class="duration-title">${dur}</div>
      <div class="duration-price">${price} $</div>
      <div class="duration-check">✔️</div>
    `;
    btn.onclick = function() {
      // Retire la sélection des autres
      grid.querySelectorAll('.shop-duration-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      // Met à jour le select caché
      select.value = dur;
    };
    grid.appendChild(btn);

    // Sélectionne le premier par défaut
    if (first) {
      btn.classList.add('selected');
      select.value = dur;
      first = false;
    }
  });
}

function addToCart() {
  const optsChecked = Array.from(document.querySelectorAll('#optionsForm .shop-option-btn.selected .option-title'))
    .map(el => el.textContent);

  currentOptions = optsChecked;
  currentDuration = document.getElementById("durationSelect").value;
const descInput = document.getElementById("projectDesc");
projectDescription = descInput ? descInput.value.trim() : projectDescription;

  if (!currentDuration) {
    alert("Veuillez sélectionner une durée/pack.");
    return;
  }

  if (!projectDescription) {
    alert("Merci de fournir une description du projet.");
    return;
  }

  // Calcul prix corrigé avec multiplicateur
  const article = articles[currentArticleKey];
  let basePrice = article.base;
  for (const opt of currentOptions) {
    basePrice += article.options[opt];
  }
  const multiplier = article.durations[currentDuration];
  const price = basePrice * multiplier;

  const item = {
    type: currentArticleKey,
    name: article.name,
    options: currentOptions,
    duration: currentDuration,
    description: projectDescription,
    price: price
  };

  cart.push(item);

  alert("Article ajouté au panier !");
  goTo("page-panier");
  updateCartUI();
}

function updateCartUI() {
  const list = document.getElementById("cartList");
  list.innerHTML = "";
  let total = 0;
  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="cart-item-row">
        <strong>${item.name}</strong>
        <span class="cart-item-label">Durée :</span>
        <span class="cart-item-value">${item.duration}</span>
      </div>
      <div class="cart-item-row">
        <span class="cart-item-label">Options :</span>
        <span class="cart-item-value">${item.options.length ? item.options.join(", ") : "Aucune"}</span>
      </div>
      <div class="cart-item-row">
        <span class="cart-item-label">Description :</span>
        <span class="cart-item-value">${item.description}</span>
      </div>
      <div class="cart-item-row">
        <span class="cart-item-label">Prix :</span>
        <span class="cart-item-value">${item.price} $</span>
      </div>
      <div class="cart-item-actions">
        <button class="cart-action-btn" title="Éditer" onclick="editCartItem(${i})">✏️</button>
        <button class="cart-action-btn" title="Dupliquer" onclick="duplicateCartItem(${i})">➕</button>
        <button class="cart-action-btn" title="Supprimer" onclick="removeCartItem(${i})">🗑️</button>
      </div>
    `;
    list.appendChild(li);
    total += item.price;
  });
  document.getElementById("totalPrice").textContent = total;
}

function goTo(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.getElementById(pageId);
  page.classList.add("active");

  // Cacher confirmation message si on revient au final
  if (pageId === "page-final") {
    document.getElementById("confirmationMessage").style.display = "none";
  }
  // Cacher devis page au besoin
  if (pageId !== "quotePage") {
    document.getElementById("quotePage").style.display = "none";
  }
}

async function handleFinal() {
  // Récupération des infos
  const pseudo = document.getElementById("pseudo").value.trim();
  const server = document.getElementById("server").value.trim();
  const country = document.getElementById("country").value.trim();
  const discord = document.getElementById("discord").value.trim();
  const typeDoc = document.querySelector('input[name="typeDoc"]:checked').value;

  if (!pseudo || !server || !country || !discord) {
    alert("Merci de remplir tous les champs.");
    return;
  }

  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

if (typeDoc === "facture") {
  const webhookUrl = "https://discord.com/api/webhooks/1421147972388786308/xwkcbvmkq2_1Kl6apPhO--Dn6OyKmkJV90r2AFg-4_xd2WuDGpm-BIiFKGD1wJES3s5c";

  // Prix total
  const totalPrice = cart.reduce((acc, cur) => acc + cur.price, 0);

  // Champs des articles
  const fields = cart.map((item, idx) => ({
    name: `🛒 ${idx+1}. ${item.name} (${item.duration})`,
    value:
      `📜 **Description** : ${item.description}\n` +
      `⚙️ **Options** : ${item.options.length ? item.options.join(", ") : "Aucune"}\n` +
      `💰 **Prix** : ${item.price} $`,
    inline: false
  }));

  // Embed stylisé
  const embed = {
    title: "📦 Nouvelle Commande Reçue",
    description: `Un nouveau client a passé commande sur la boutique.`,
    color: 0x38bdf8, // bleu clair
    fields: fields,
    thumbnail: {
      url: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png" // icône panier
    },
    image: {
      url: "https://i.ibb.co/F8cKccr/store-banner.png" // bannière illustrative (tu peux changer)
    },
    footer: {
      text: `💵 Total : ${totalPrice} $ | Merci ${pseudo} !`
    },
    timestamp: new Date().toISOString(),
    author: {
      name: pseudo,
      icon_url: "https://skins.nationsglory.fr/face/" + pseudo + "/3d/15"
    }
  };

  // Contenu du message
  const content = {
    content: `🧾 **Nouvelle commande de ${pseudo}**\n🌍 Serveur: ${server}\n🏳️ Pays: ${country}\n💬 Discord: ${discord}`,
    embeds: [embed]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content)
    });

    if (!response.ok) throw new Error("Erreur lors de l'envoi au webhook.");

    // Confirmation
    document.getElementById("confirmationMessage").textContent =
      `✅ Merci pour votre commande, ${pseudo} ! Ouvre un ticket pour finaliser si ce n'est pas déjà fait.`;
    document.getElementById("confirmationMessage").style.display = "block";

    // Vider panier & reset formulaire
    cart = [];
    updateCartUI();
    document.getElementById("finalForm").reset();

  } catch (error) {
    alert("❌ Erreur lors de l'envoi de la commande : " + error.message);
  }


  } else if (typeDoc === "devis") {
    // Affichage du devis dans la page HTML

    const totalPrice = cart.reduce((acc, cur) => acc + cur.price, 0);

    let html = `<p><strong>Pseudo InGame :</strong> ${pseudo}<br>
                <strong>Serveur :</strong> ${server}<br>
                <strong>Pays :</strong> ${country}<br>
                <strong>Discord :</strong> ${discord}</p>`;

    html += `<table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Durée/Pack</th>
                  <th>Options</th>
                  <th>Description</th>
                  <th>Prix</th>
                </tr>
              </thead>
              <tbody>`;

    cart.forEach((item, i) => {
      html += `<tr>
                <td>${i+1}</td>
                <td>${item.name}</td>
                <td>${item.duration}</td>
                <td>${item.options.length ? item.options.join(", ") : "Aucune"}</td>
                <td>${item.description}</td>
                <td>${item.price} $</td>
              </tr>`;
    });

    html += `</tbody>
              <tfoot>
                <tr class="total-row">
                  <td colspan="5" style="text-align:right;">Total :</td>
                  <td>${totalPrice} $</td>
                </tr>
              </tfoot>
            </table>`;

    document.getElementById("quoteContent").innerHTML = html;
    document.getElementById("quotePage").style.display = "block";
    goTo("quotePage");
  }
}

function removeCartItem(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function duplicateCartItem(index) {
  const item = { ...cart[index], options: [...cart[index].options] };
  cart.push(item);
  updateCartUI();
}

function editCartItem(index) {
  // Pré-remplir les étapes avec les valeurs de l'article à éditer
  const item = cart[index];
  currentArticleKey = item.type;
  document.getElementById("projectDesc").value = item.description;
  loadOptionsForm(item.type);
  // Coche les options
  setTimeout(() => {
    item.options.forEach(opt => {
      const id = "opt_" + opt.replace(/\s+/g, "_");
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change'));
      }
    });
  }, 50);
  // Sélectionne la durée
  setTimeout(() => {
    document.getElementById("durationSelect").value = item.duration;
    document.querySelectorAll('.shop-duration-btn').forEach(b => b.classList.remove('selected'));
    const btn = Array.from(document.querySelectorAll('.shop-duration-btn')).find(b => b.textContent.includes(item.duration));
    if (btn) btn.classList.add('selected');
  }, 50);
  goTo("page-options");
}

// Nouveau code proposé
const _selectArticle = window.selectArticle;
window.selectArticle = function(key) {
  _selectArticle(key);
  setTimeout(() => goTo('page-desc'), 50);
};

function goToOptionsStep() {
  // Vérifie la description avant d’avancer
  const desc = document.getElementById('projectDesc').value.trim();
  if (!desc) {
    alert('Merci de décrire ton projet.');
    return;
  }
  goTo('page-options');
}

function goToDurationStep() {
  goTo('page-duration');
}

function goToCartStep() {
  goTo('page-panier');
}

function goToFinalStep() {
  goTo('page-final');
}