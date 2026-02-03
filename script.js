// Калькулятор ремонта
const servicePrices = {
  screen: 3000,
  battery: 500,
  port: 800
};

const brandM = {
  apple: 1.3,
  samsung: 1.2,
  xiaomi: 1.0
};

function calculatePrice() {
  const quantity = parseInt(document.getElementById('field1').value) || 1;
  const serviceTypeElement = document.querySelector('input[name="serviceType"]:checked');
  
  if (!serviceTypeElement) {
    document.getElementById('result').textContent = 'Выберите тип услуги';
    return;
  }
  
  const serviceType = serviceTypeElement.value;
  const brand = document.getElementById('brand').value;
  const urgent = document.getElementById('urgent').checked;
  const warranty = document.getElementById('warranty').checked;
  const delivery = document.getElementById('delivery').checked;

  let basePrice = servicePrices[serviceType];
  basePrice *= brandM[brand];
  
  if (urgent) basePrice *= 1.2;
  if (warranty) basePrice *= 1.15;
  if (delivery) basePrice += 500;
  
  const totalPrice = Math.round(basePrice * quantity);
  
  document.getElementById('result').textContent = `Общая стоимость: ${totalPrice} руб.`;
}

// Галерея
$(document).ready(function() {
  const $track = $('.gallery-track');
  const $slides = $('.gallery-slide');
  const $prevBtn = $('.gallery-nav.prev');
  const $nextBtn = $('.gallery-nav.next');
  const $currentPage = $('.current-page');
  const $totalPages = $('.total-pages');
  const $pagerDots = $('.pager-dots');
  
  let currentSlide = 0;
  let slidesToShow = 3;
  let totalPages = 0;

  function initGallery() {
    updateSlidesToShow();
    createPagerDots();
    updateSlider();
    updateNavigation();
    
    $prevBtn.on('click', prevSlide);
    $nextBtn.on('click', nextSlide);
    $(window).on('resize', onResize);
  }

  function updateSlidesToShow() {
    const width = $(window).width();
    
    if (width <= 480) {
      slidesToShow = 1;
    } else if (width <= 768) {
      slidesToShow = 2;
    } else {
      slidesToShow = 3;
    }
    
    const slideWidth = 100 / slidesToShow;
    $slides.css('flex', `0 0 ${slideWidth}%`);
    
    totalPages = Math.ceil($slides.length / slidesToShow);
    updatePageInfo();
  }

  function createPagerDots() {
    $pagerDots.empty();
    
    for (let i = 0; i < totalPages; i++) {
      const $dot = $('<button>')
        .addClass('pager-dot')
        .attr('data-page', i)
        .on('click', function() {
          goToPage(i);
        });
      
      if (i === currentSlide) {
        $dot.addClass('active');
      }
      
      $pagerDots.append($dot);
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlider();
    }
  }

  function nextSlide() {
    if (currentSlide < totalPages - 1) {
      currentSlide++;
      updateSlider();
    }
  }

  function goToPage(pageIndex) {
    currentSlide = pageIndex;
    updateSlider();
  }

  function updateSlider() {
    const translateX = -currentSlide * 100;
    $track.css('transform', `translateX(${translateX}%)`);
    
    updatePagerDots();
    updateNavigation();
    updatePageInfo();
  }

  function updatePagerDots() {
    $('.pager-dot').removeClass('active');
    $(`.pager-dot[data-page="${currentSlide}"]`).addClass('active');
  }

  function updateNavigation() {
    $prevBtn.prop('disabled', currentSlide === 0);
    $nextBtn.prop('disabled', currentSlide === totalPages - 1);
  }

  function updatePageInfo() {
    $currentPage.text(currentSlide + 1);
    $totalPages.text(totalPages);
  }

  function onResize() {
    const oldCurrentSlide = currentSlide;
    
    updateSlidesToShow();
    createPagerDots();
    
    currentSlide = Math.min(oldCurrentSlide, totalPages - 1);
    
    updateSlider();
  }

  initGallery();
});

// Форма обратной связи
document.addEventListener('DOMContentLoaded', function() {
  const feedbackPopup = document.getElementById('feedbackPopup');
  const openFeedbackBtn = document.getElementById('openFeedbackBtn');
  const closeFeedbackBtn = document.getElementById('closeFeedbackBtn');
  const feedbackForm = document.getElementById('feedbackForm');
  const feedbackMessageContainer = document.getElementById('feedbackMessageContainer');
  const feedbackSubmitBtn = document.getElementById('feedbackSubmitBtn');
  const feedbackSubmitText = document.getElementById('feedbackSubmitText');
  const feedbackSubmitLoading = document.getElementById('feedbackSubmitLoading');
  const feedbackPrivacyPolicyLink = document.getElementById('feedbackPrivacyPolicyLink');
  
  const STORAGE_KEY = 'feedback_form_data';
  const FORM_SUBMIT_URL = 'https://formcarry.com/s/PhXPhgjJcoC';
  
  function restoreFormData() {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const formData = JSON.parse(savedData);
        
        document.getElementById('feedbackFullName').value = formData.fullName || '';
        document.getElementById('feedbackEmail').value = formData.email || '';
        document.getElementById('feedbackPhone').value = formData.phone || '';
        document.getElementById('feedbackOrganization').value = formData.organization || '';
        document.getElementById('feedbackMessage').value = formData.message || '';
        document.getElementById('feedbackPrivacyPolicy').checked = formData.privacyPolicy || false;
      }
    } catch (error) {
      console.error('Ошибка при восстановлении данных из LocalStorage:', error);
    }
  }
  
  function saveFormData() {
    const formData = {
      fullName: document.getElementById('feedbackFullName').value,
      email: document.getElementById('feedbackEmail').value,
      phone: document.getElementById('feedbackPhone').value,
      organization: document.getElementById('feedbackOrganization').value,
      message: document.getElementById('feedbackMessage').value,
      privacyPolicy: document.getElementById('feedbackPrivacyPolicy').checked
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }
  
  function clearFormData() {
    localStorage.removeItem(STORAGE_KEY);
    feedbackForm.reset();
  }
  
  function showMessage(text, type) {
    feedbackMessageContainer.innerHTML = '';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `feedback-message ${type}`;
    messageDiv.textContent = text;
    
    feedbackMessageContainer.appendChild(messageDiv);
    
    if (type === 'success') {
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.style.opacity = '0';
          messageDiv.style.transition = 'opacity 0.5s';
          setTimeout(() => {
            if (messageDiv.parentNode) {
              messageDiv.remove();
            }
          }, 500);
        }
      }, 5000);
    }
  }
  
  function openForm() {
    feedbackPopup.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    history.pushState({ formOpened: true }, '', '#feedback-form');
    
    document.getElementById('feedbackFullName').focus();
  }
  
  function closeForm() {
    feedbackPopup.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    if (history.state && history.state.formOpened) {
      history.back();
    }
    
    feedbackMessageContainer.innerHTML = '';
  }
  
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!feedbackForm.checkValidity()) {
      feedbackForm.reportValidity();
      return;
    }
    
    feedbackSubmitBtn.disabled = true;
    feedbackSubmitText.textContent = 'Отправка...';
    feedbackSubmitLoading.style.display = 'inline-block';
    
    try {
      // Собираем данные формы
      const formData = {
        fullName: document.getElementById('feedbackFullName').value,
        email: document.getElementById('feedbackEmail').value,
        phone: document.getElementById('feedbackPhone').value,
        organization: document.getElementById('feedbackOrganization').value,
        message: document.getElementById('feedbackMessage').value,
        privacyPolicy: document.getElementById('feedbackPrivacyPolicy').checked ? 'Да' : 'Нет'
      };
      
      // Создаем скрытый iframe для отправки формы (обход CORS)
      const iframe = document.createElement('iframe');
      iframe.name = 'formcarry-iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Создаем скрытую форму для отправки через iframe
      const hiddenForm = document.createElement('form');
      hiddenForm.method = 'POST';
      hiddenForm.action = FORM_SUBMIT_URL;
      hiddenForm.target = 'formcarry-iframe';
      hiddenForm.style.display = 'none';
      
      // Добавляем данные в форму
      Object.keys(formData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = formData[key];
        hiddenForm.appendChild(input);
      });
      
      document.body.appendChild(hiddenForm);
      
      // Отправляем форму
      hiddenForm.submit();
      
      // Удаляем элементы после отправки
      setTimeout(() => {
        document.body.removeChild(hiddenForm);
        document.body.removeChild(iframe);
      }, 1000);
      
      // Показываем сообщение об успехе
      showMessage('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
      clearFormData();
      
      // Закрытие формы через 3 секунды
      setTimeout(() => {
        closeForm();
      }, 3000);
      
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      
      // Альтернативный метод через JSONP (если iframe не работает)
      try {
        // Собираем данные для отправки
        const formData = {
          fullName: document.getElementById('feedbackFullName').value,
          email: document.getElementById('feedbackEmail').value,
          phone: document.getElementById('feedbackPhone').value,
          organization: document.getElementById('feedbackOrganization').value,
          message: document.getElementById('feedbackMessage').value,
          privacyPolicy: document.getElementById('feedbackPrivacyPolicy').checked ? 'Да' : 'Нет'
        };
        
        // Создаем URL с параметрами (GET запрос)
        const params = new URLSearchParams(formData).toString();
        const url = `${FORM_SUBMIT_URL}?${params}`;
        
        // Используем image beacon как запасной вариант
        const img = new Image();
        img.src = url;
        
        showMessage('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
        clearFormData();
        
        setTimeout(() => {
          closeForm();
        }, 3000);
        
      } catch (fallbackError) {
        console.error('Ошибка при альтернативной отправке:', fallbackError);
        showMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз позже.', 'error');
      }
    } finally {
      feedbackSubmitBtn.disabled = false;
      feedbackSubmitText.textContent = 'Отправить сообщение';
      feedbackSubmitLoading.style.display = 'none';
    }
  }
  
  // Инициализация формы обратной связи
  function initFeedbackForm() {
    restoreFormData();
    
    openFeedbackBtn.addEventListener('click', openForm);
    closeFeedbackBtn.addEventListener('click', closeForm);
    feedbackForm.addEventListener('submit', handleFormSubmit);
    feedbackForm.addEventListener('input', saveFormData);
    
    feedbackPrivacyPolicyLink.addEventListener('click', function(e) {
      e.preventDefault();
      showMessage('Политика обработки персональных данных: мы гарантируем конфиденциальность ваших данных и используем их только для связи с вами.', 'info');
    });
    
    feedbackPopup.addEventListener('click', function(e) {
      if (e.target === feedbackPopup) {
        closeForm();
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && feedbackPopup.classList.contains('active')) {
        closeForm();
      }
    });
    
    window.addEventListener('popstate', function(e) {
      if (feedbackPopup.classList.contains('active')) {
        closeForm();
      }
    });
  }
  
  // Инициализация калькулятора
  function initCalculator() {
    document.getElementById('field1').addEventListener('input', calculatePrice);
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', calculatePrice);
    });
    document.getElementById('brand').addEventListener('change', calculatePrice);
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', calculatePrice);
    });
    
    calculatePrice();
  }
  
  // Инициализация всех компонентов
  initCalculator();
  initFeedbackForm();
  
  if (window.location.hash === '#feedback-form') {
    setTimeout(() => {
      openForm();
    }, 100);
  }
});