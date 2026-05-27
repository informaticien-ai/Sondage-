// ==================== TOGGLE FUNCTIONS ====================

/**
 * Affiche ou masque la question sur le nombre de membres
 * @param {boolean} show - true pour afficher, false pour masquer
 */
function toggleFamille(show) {
  const element = document.getElementById('qMembres');
  if (show) {
    element.classList.remove('hidden');
    element.querySelector('input').focus();
  } else {
    element.classList.add('hidden');
    element.querySelector('input').value = '';
  }
}

/**
 * Affiche ou masque la question sur les difficultés
 * @param {boolean} show - true pour afficher, false pour masquer
 */
function toggleDifficulte(show) {
  const element = document.getElementById('qDifficulte');
  if (show) {
    element.classList.remove('hidden');
    element.querySelector('input').focus();
  } else {
    element.classList.add('hidden');
    element.querySelector('input').value = '';
  }
}

// ==================== FORM SUBMISSION ====================

/**
 * Initialise les écouteurs d'événements du formulaire
 */
document.addEventListener('DOMContentLoaded', function() {
  const surveyForm = document.getElementById('surveyForm');
  
  // Vérification de l'existence du formulaire
  if (surveyForm) {
    surveyForm.addEventListener('submit', handleFormSubmit);
  }
});

/**
 * Gère la soumission du formulaire
 * @param {Event} e - L'événement de soumission
 */
function handleFormSubmit(e) {
  e.preventDefault();
  
  // Récupération des données du formulaire
  const formData = new FormData(document.getElementById('surveyForm'));
  const data = Object.fromEntries(formData.entries());
  
  // Validation basique
  if (!validateForm(data)) {
    showAlert('Veuillez remplir tous les champs obligatoires.', 'error');
    return;
  }
  
  // Création du message WhatsApp
  const message = formatWhatsAppMessage(data);
  
  // Numéro WhatsApp avec code pays (Congo: +243)
  const numero = '243970709671';
  const whatsappUrl = `https://wa.me/${numero}?text=${message}`;
  
  // Ouverture de WhatsApp
  window.open(whatsappUrl, '_blank');
  
  // Affichage du message de succès
  showSuccessMessage();
}

/**
 * Valide les données du formulaire
 * @param {Object} data - Les données du formulaire
 * @returns {boolean} true si valide, false sinon
 */
function validateForm(data) {
  const requiredFields = [
    'famille',
    'frequence',
    'transport',
    'livraison_utile',
    'confiance',
    'type_farine',
    'marque',
    'prix_livraison',
    'lieu_achat',
    'important',
    'difficulte',
    'tester'
  ];
  
  for (let field of requiredFields) {
    if (!data[field] || data[field].trim() === '') {
      return false;
    }
  }
  
  // Vérification spécifique pour les champs conditionnels
  if (data.famille === 'oui' && (!data.membres || data.membres.trim() === '')) {
    return false;
  }
  
  if (data.difficulte === 'oui' && (!data.difficulte_detail || data.difficulte_detail.trim() === '')) {
    return false;
  }
  
  return true;
}

/**
 * Formate les données en message WhatsApp
 * @param {Object} data - Les données du formulaire
 * @returns {string} Le message encodé en URL
 */
function formatWhatsAppMessage(data) {
  const timestamp = new Date().toLocaleString('fr-FR');
  
  let message = `*🌾 SONDAGE FARINE FUFU*\n`;
  message += `*Date & Heure:* ${timestamp}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // Question 1
  message += `*Q1. Famille nombreuse:* ${formatAnswer(data.famille)}\n`;
  if (data.famille === 'oui') {
    message += `   ├─ *Nombre de membres:* ${data.membres || '0'}\n`;
  }
  
  // Question 2
  message += `*Q2. Fréquence d'achat/mois:* ${data.frequence || '0'} fois\n`;
  
  // Question 3
  message += `*Q3. Transport difficile:* ${formatAnswer(data.transport)}\n`;
  
  // Question 4
  message += `*Q4. Service de livraison utile:* ${data.livraison_utile || 'Non répondu'}\n`;
  
  // Question 5
  message += `*Q5. Confiance livraison:* ${formatAnswer(data.confiance)}\n`;
  
  // Question 6
  message += `*Q6. Type de farine préféré:* ${data.type_farine || 'Non répondu'}\n`;
  
  // Question 7
  message += `*Q7. Marque farine blanche:* ${data.marque || 'Non répondu'}\n`;
  
  // Question 8
  message += `*Q8. Budget livraison:* ${data.prix_livraison || '0'} FC\n`;
  
  // Question 9
  message += `*Q9. Lieu d'achat habituel:* ${data.lieu_achat || 'Non répondu'}\n`;
  
  // Question 10
  message += `*Q10. Priorité:* ${data.important || 'Non répondu'}\n`;
  
  // Question 11
  message += `*Q11. Difficultés à trouver:* ${formatAnswer(data.difficulte)}\n`;
  if (data.difficulte === 'oui') {
    message += `   ├─ *Détails:* ${data.difficulte_detail || 'Aucun détail'}\n`;
  }
  
  // Question 12
  message += `*Q12. Tester nouvelle marque:* ${formatAnswer(data.tester)}\n`;
  
  message += `\n━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `✅ *Sondage complété avec succès*`;
  
  // Encoder le TOUT le message en une seule fois
  return encodeURIComponent(message);
}

/**
 * Formate les réponses (oui/non -> Oui/Non)
 * @param {string} answer - La réponse brute
 * @returns {string} La réponse formatée
 */
function formatAnswer(answer) {
  const answerMap = {
    'oui': '✅ Oui',
    'non': '❌ Non',
    'peut-etre': '❓ Peut-être'
  };
  return answerMap[answer] || answer;
}

/**
 * Affiche le message de succès
 */
function showSuccessMessage() {
  const form = document.getElementById('surveyForm');
  const successMsg = document.getElementById('successMsg');
  
  if (form && successMsg) {
    form.style.display = 'none';
    successMsg.style.display = 'block';
    
    // Scroll vers le message de succès
    setTimeout(() => {
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    // Réinitialisation après 5 secondes (optionnel)
    setTimeout(() => {
      resetForm();
    }, 5000);
  }
}

/**
 * Réinitialise le formulaire
 */
function resetForm() {
  const form = document.getElementById('surveyForm');
  const successMsg = document.getElementById('successMsg');
  
  if (form && successMsg) {
    form.reset();
    form.style.display = 'flex';
    successMsg.style.display = 'none';
    
    // Réinitialisation des champs conditionnels
    document.getElementById('qMembres').classList.add('hidden');
    document.getElementById('qDifficulte').classList.add('hidden');
    
    // Scroll vers le haut du formulaire
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Affiche une alerte personnalisée
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type d'alerte ('success', 'error', 'warning')
 */
function showAlert(message, type = 'info') {
  // Créer un élément d'alerte
  const alertDiv = document.createElement('div');
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#25D366' : '#ffa502'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    font-size: 14px;
    font-weight: 600;
    z-index: 1000;
    animation: slideInRight 0.4s ease-out;
  `;
  
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);
  
  // Ajouter l'animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Supprimer l'alerte après 4 secondes
  setTimeout(() => {
    alertDiv.style.animation = 'slideInRight 0.4s ease-out reverse';
    setTimeout(() => alertDiv.remove(), 400);
  }, 4000);
}

// ==================== ENHANCEMENTS ====================

/**
 * Ajoute les raccourcis clavier
 */
document.addEventListener('keydown', function(event) {
  // Ctrl + Entrée pour soumettre le formulaire
  if (event.ctrlKey && event.key === 'Enter') {
    const form = document.getElementById('surveyForm');
    if (form && form.style.display !== 'none') {
      form.dispatchEvent(new Event('submit'));
    }
  }
});

/**
 * Prévient les envois multiples accidentels
 */
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('surveyForm');
  const button = form?.querySelector('.btn-submit');
  
  if (button) {
    let isSubmitting = false;
    
    form.addEventListener('submit', function() {
      if (isSubmitting) return;
      isSubmitting = true;
      button.disabled = true;
      button.textContent = '⏳ Envoi en cours...';
      
      // Réactiver le bouton après 3 secondes
      setTimeout(() => {
        isSubmitting = false;
        button.disabled = false;
        button.textContent = '📲 Envoyer sur WhatsApp';
      }, 3000);
    });
  }
});
