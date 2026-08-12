/* ==================== CART FUNCTIONALITY ==================== */

// Initialize cart from localStorage
function initializeCart() {
  const cart = localStorage.getItem('gmiCart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('gmiCart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = initializeCart();
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

// Add Live Class to Cart
function addLiveClassToCart() {
  const cart = initializeCart();
  
  const liveClass = {
    id: 'live-class-' + Date.now(),
    name: 'Online Live Class Package',
    type: 'live-class',
    price: 50000, // UGX or your currency
    description: 'Interactive live class session with expert instructors',
    schedule: 'Weekdays, 6:00 PM EAT',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'All Subjects'],
    sessionType: 'Group', // or individual
    quantity: 1,
    addedDate: new Date().toISOString()
  };

  // Check if already in cart
  const existingClass = cart.find(item => item.type === 'live-class');
  if (existingClass) {
    alert('Live class already in your cart! Proceed to checkout.');
    window.location.href = 'checkout.html';
    return;
  }

  cart.push(liveClass);
  saveCart(cart);

  // Show confirmation
  showNotification('Live Class added to cart! Proceeding to checkout...', 'success');
  
  // Redirect to checkout after 1.5 seconds
  setTimeout(() => {
    window.location.href = 'checkout.html';
  }, 1500);
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Add styles if not already added
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
      }
      
      .notification-success {
        background-color: #27ae60;
        color: white;
      }
      
      .notification-info {
        background-color: #3498db;
        color: white;
      }
      
      .notification-warning {
        background-color: #f39c12;
        color: white;
      }
      
      .notification-error {
        background-color: #e74c3c;
        color: white;
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/* ==================== LIVE CLASS BOOKING MODAL ==================== */

function openLiveClassModal() {
  const modal = document.createElement('div');
  modal.className = 'live-class-modal';
  modal.id = 'liveClassModal';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeLiveClassModal()"></div>
    <div class="modal-content">
      <button class="modal-close" onclick="closeLiveClassModal()">
        <i class="fa-solid fa-times"></i>
      </button>
      
      <h2>Join Live Class</h2>
      <p class="modal-subtitle">Select your preferences and proceed to payment</p>
      
      <form id="liveClassForm">
        <div class="form-group">
          <label for="name">Full Name *</label>
          <input type="text" id="name" name="name" required placeholder="Enter your full name">
        </div>
        
        <div class="form-group">
          <label for="email">Email Address *</label>
          <input type="email" id="email" name="email" required placeholder="your@email.com">
        </div>
        
        <div class="form-group">
          <label for="phone">Phone Number *</label>
          <input type="tel" id="phone" name="phone" required placeholder="+256 xxx xxx xxx">
        </div>
        
        <div class="form-group">
          <label for="subject">Subject *</label>
          <select id="subject" name="subject" required>
            <option value="">-- Select Subject --</option>
            <option value="mathematics">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="english">English</option>
            <option value="biology">Biology</option>
            <option value="all">All Subjects Package</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="sessionType">Session Type *</label>
          <select id="sessionType" name="sessionType" required>
            <option value="">-- Select Type --</option>
            <option value="group">Group Session (5-10 students)</option>
            <option value="private">Private Session (1-on-1)</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="frequency">Package Frequency *</label>
          <select id="frequency" name="frequency" required>
            <option value="">-- Select Frequency --</option>
            <option value="single">Single Session (1 class)</option>
            <option value="weekly">Weekly (4 classes/month)</option>
            <option value="monthly">Monthly (Unlimited)</option>
          </select>
        </div>
        
        <div class="pricing-summary">
          <h3>Pricing Summary</h3>
          <div class="price-item">
            <span>Base Class Fee:</span>
            <span id="basePrice">50,000 UGX</span>
          </div>
          <div class="price-item">
            <span>Session Type:</span>
            <span id="sessionPrice">+0 UGX</span>
          </div>
          <div class="price-total">
            <span>Total Amount:</span>
            <span id="totalPrice">50,000 UGX</span>
          </div>
        </div>
        
        <div class="form-agreement">
          <input type="checkbox" id="agree" name="agree" required>
          <label for="agree">I agree to the <a href="terms.html" target="_blank">Terms of Service</a> and <a href="privacy-policy.html" target="_blank">Privacy Policy</a></label>
        </div>
        
        <button type="submit" class="btn-submit">
          <i class="fa-solid fa-credit-card"></i>
          Proceed to Payment
        </button>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  addModalStyles();
  
  // Handle form submission
  document.getElementById('liveClassForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitLiveClassBooking();
  });
  
  // Handle price updates
  document.getElementById('sessionType').addEventListener('change', updatePrice);
  document.getElementById('frequency').addEventListener('change', updatePrice);
}

function closeLiveClassModal() {
  const modal = document.getElementById('liveClassModal');
  if (modal) {
    modal.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => modal.remove(), 300);
  }
}

function updatePrice() {
  const basePrice = 50000;
  const sessionType = document.getElementById('sessionType').value;
  const frequency = document.getElementById('frequency').value;
  
  let sessionPrice = 0;
  let frequencyMultiplier = 1;
  
  if (sessionType === 'private') {
    sessionPrice = 20000;
  }
  
  if (frequency === 'weekly') {
    frequencyMultiplier = 3.5; // Slight discount for bulk
  } else if (frequency === 'monthly') {
    frequencyMultiplier = 8; // Better discount for monthly
  }
  
  const totalPrice = (basePrice + sessionPrice) * frequencyMultiplier;
  
  document.getElementById('sessionPrice').textContent = 
    sessionPrice > 0 ? `+${sessionPrice.toLocaleString()} UGX` : '+0 UGX';
  
  document.getElementById('totalPrice').textContent = 
    totalPrice.toLocaleString() + ' UGX';
}

function submitLiveClassBooking() {
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    subject: document.getElementById('subject').value,
    sessionType: document.getElementById('sessionType').value,
    frequency: document.getElementById('frequency').value,
    totalAmount: document.getElementById('totalPrice').textContent.replace(/[^0-9]/g, ''),
    bookingDate: new Date().toISOString()
  };
  
  // Save booking to localStorage
  const bookings = JSON.parse(localStorage.getItem('liveClassBookings') || '[]');
  bookings.push(formData);
  localStorage.setItem('liveClassBookings', JSON.stringify(bookings));
  
  // Close modal
  closeLiveClassModal();
  
  // Show success message
  showNotification('Booking submitted! Redirecting to payment...', 'success');
  
  // Redirect to checkout
  setTimeout(() => {
    window.location.href = 'checkout.html?booking=' + btoa(JSON.stringify(formData));
  }, 1500);
}

function addModalStyles() {
  if (!document.getElementById('modal-styles')) {
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
      .live-class-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
      }
      
      .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
      }
      
      .modal-content {
        position: relative;
        background-color: white;
        border-radius: 12px;
        padding: 40px;
        max-width: 600px;
        width: 95%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        animation: slideUp 0.3s ease-out;
      }
      
      .modal-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        font-size: 24px;
        color: #333;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s;
      }
      
      .modal-close:hover {
        background-color: #f5f5f5;
        color: #b44510;
      }
      
      .modal-content h2 {
        color: #1a5f8e;
        margin-bottom: 10px;
        font-size: 28px;
      }
      
      .modal-subtitle {
        color: #666;
        margin-bottom: 30px;
        font-size: 14px;
      }
      
      .form-group {
        margin-bottom: 20px;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 8px;
        color: #333;
        font-weight: 600;
        font-size: 14px;
      }
      
      .form-group input,
      .form-group select {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.3s;
      }
      
      .form-group input:focus,
      .form-group select:focus {
        outline: none;
        border-color: #1a5f8e;
        box-shadow: 0 0 0 3px rgba(26, 95, 142, 0.1);
      }
      
      .pricing-summary {
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
        border-left: 4px solid #b44510;
      }
      
      .pricing-summary h3 {
        color: #1a5f8e;
        font-size: 14px;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .price-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 13px;
        color: #666;
      }
      
      .price-total {
        display: flex;
        justify-content: space-between;
        padding-top: 12px;
        border-top: 1px solid #ddd;
        font-weight: 700;
        color: #1a5f8e;
        font-size: 16px;
      }
      
      .form-agreement {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin: 20px 0;
        font-size: 13px;
      }
      
      .form-agreement input {
        width: auto;
        margin-top: 3px;
      }
      
      .form-agreement a {
        color: #1a5f8e;
        text-decoration: none;
      }
      
      .form-agreement a:hover {
        text-decoration: underline;
      }
      
      .btn-submit {
        width: 100%;
        padding: 14px;
        background-color: #b44510;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
      
      .btn-submit:hover {
        background-color: #8b3409;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(180, 69, 16, 0.3);
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
      
      @keyframes slideUp {
        from {
          transform: translateY(50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @media (max-width: 768px) {
        .modal-content {
          padding: 20px;
          width: 90%;
        }
        
        .modal-content h2 {
          font-size: 24px;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ==================== INITIALIZE ON PAGE LOAD ==================== */

document.addEventListener('DOMContentLoaded', function() {
  // Update cart count on page load
  updateCartCount();
  
  // Add click handlers to buttons
  const joinButtons = document.querySelectorAll('[data-action="join-live-class"]');
  joinButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openLiveClassModal();
    });
  });
});

/* ==================== SEARCH FUNCTIONALITY ==================== */

document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = document.getElementById('searchInput').value.trim();
      if (query) {
        window.location.href = 'search.html?q=' + encodeURIComponent(query);
      }
    });
  }
});

/* ==================== CATEGORY MANAGEMENT ==================== */

function closeCategoryItems() {
  document.getElementById('categoryItemsPanel').style.display = 'none';
}

/* ==================== UTILITY FUNCTIONS ==================== */

function formatPrice(price) {
  return price.toLocaleString() + ' UGX';
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
