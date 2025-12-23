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

function calculatePrice() { // Исправлено название функции (было calculatePrices)
  const quantity = parseInt(document.getElementById('field1').value) || 1;
  const serviceTypeElement = document.querySelector('input[name="serviceType"]:checked');
  
  // Проверка, выбран ли тип услуги
  if (!serviceTypeElement) {
    document.getElementById('result').textContent = 'Выберите тип услуги';
    return;
  }
  
  const serviceType = serviceTypeElement.value;
  const brand = document.getElementById('brand').value;
  const urgent = document.getElementById('urgent').checked;
  const warranty = document.getElementById('warranty').checked;
  const delivery = document.getElementById('delivery').checked;

  // Рассчитываем базовую стоимость
  let basePrice = servicePrices[serviceType];
  
  // Применяем коэффициент бренда
  basePrice *= brandM[brand];
  
  // Применяем дополнительные опции
  if (urgent) basePrice *= 1.2;
  if (warranty) basePrice *= 1.15;
  if (delivery) basePrice += 500;
  
  // Умножаем на количество
  const totalPrice = Math.round(basePrice * quantity);
  
  // Отображаем результат
  document.getElementById('result').textContent = 
    `Общая стоимость: ${totalPrice} руб.`;
}

// Исправлены обработчики событий
document.getElementById('field1').addEventListener('input', calculatePrice); // Исправлен id
document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', calculatePrice);
});
document.getElementById('brand').addEventListener('change', calculatePrice);
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', calculatePrice);
});

// Первоначальный расчет
calculatePrice();