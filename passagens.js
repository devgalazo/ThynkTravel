document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("resultado");
  const dados = JSON.parse(localStorage.getItem("resultadosVoos"));

  if (!dados || !dados.data || dados.data.length === 0) {
    container.innerHTML = "<p class='text-center text-gray-600 text-lg'>Nenhum voo encontrado.</p>";
    return;
  }

  // Função de formatação de data e hora
  const formatarDataHora = (dataIso) => {
    const data = new Date(dataIso);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const hora = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return { data: `${dia}/${mes}`, hora: `${hora}:${minutos}` };
  };

  const companhiasAereas = {
      "G3": "GOL Linhas Aéreas",
      "LA": "LATAM Airlines Brasil",
      "AD": "Azul Linhas Aéreas Brasileiras",
      "AA": "American Airlines",
      "DL": "Delta Air Lines",
      "UA": "United Airlines",
      "AF": "Air France",
      "LH": "Lufthansa",
      "BA": "British Airways",
      "EK": "Emirates",
      "QR": "Qatar Airways",
      "TK": "Turkish Airlines",
      "AC": "Air Canada",
      "IB": "Iberia",
      "KL": "KLM Royal Dutch Airlines",
      "QF": "Qantas"
  };

  dados.data.forEach((oferta, index) => {
    const ida = oferta.itineraries[0].segments[0];
    const volta = oferta.itineraries[1]?.segments[0];

    const partidaIda = formatarDataHora(ida.departure.at);
    const chegadaIda = formatarDataHora(ida.arrival.at);
    const origemIda = ida.departure.iataCode;
    const destinoIda = ida.arrival.iataCode;
    const companhiaIda = companhiasAereas[ida.carrierCode] || ida.carrierCode;

    let cardVolta = '';
    if (volta) {
      const partidaVolta = formatarDataHora(volta.departure.at);
      const chegadaVolta = formatarDataHora(volta.arrival.at);
      const origemVolta = volta.departure.iataCode;
      const destinoVolta = volta.arrival.iataCode;
      const companhiaVolta = companhiasAereas[volta.carrierCode] || volta.carrierCode;

      cardVolta = `
        <div class="flex justify-between items-center text-sm px-4 py-2">
          <div class="flex gap-2 items-start">
            <span class="text-2xl">🛬</span>
            <div>
              <p class="font-semibold text-gray-800">Volta <span class="text-indigo-600">${companhiaVolta}</span></p>
              <p class="text-gray-500">Ter, ${partidaVolta.data} - Econômica</p>
              <a href="#" class="text-sm text-blue-500 underline">Detalhes da volta</a>
            </div>
          </div>
          <div class="text-right">
            <p class="text-gray-800 font-semibold">${partidaVolta.hora} → ${chegadaVolta.hora}</p>
            <p class="text-xs text-gray-500">${origemVolta} - ${destinoVolta}</p>
            <p class="text-xs text-[#f97316] font-semibold">1 parada</p>
          </div>
        </div>
      `;
    }

    const preco = parseFloat(oferta.price.total).toFixed(2).replace('.', ',');

    const card = `
      <div class="flex bg-white rounded-2xl shadow-md overflow-hidden w-full border border-gray-200">
        <div class="flex-1 p-4 flex flex-col justify-between">
          <div class="mb-4">
          ${index < 2 ? `<span class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">Voo mais barato</span>` : ''}

            <!-- Ida -->
            <div class="flex justify-between items-center text-sm px-2 py-2">
              <div class="flex gap-2 items-start">
                <span class="text-2xl">🛫</span>
                <div>
                  <p class="font-semibold text-gray-800">Ida <span class="text-indigo-600">${companhiaIda}</span></p>
                  <p class="text-gray-500">Seg, ${partidaIda.data} - Econômica</p>
                  <a href="#" class="text-sm text-blue-500 underline">Detalhes da ida</a>
                </div>
              </div>
              <div class="text-right">
                <p class="text-gray-800 font-semibold">${partidaIda.hora} → ${chegadaIda.hora}</p>
                <p class="text-xs text-gray-500">${origemIda} - ${destinoIda}</p>
                <p class="text-xs text-orange-500 font-semibold">1 parada</p>
              </div>
            </div>

            <hr class="my-2 border-gray-200" />

            <!-- Volta -->
            ${cardVolta}
          </div>
        </div>

        <!-- Preço -->
        <div class="w-64 bg-gray-50 border-l border-gray-200 p-6 flex flex-col justify-between">
          <div class="text-right">
            <p class="text-gray-800 text-lg font-semibold">R$ ${preco}</p>
            <p class="text-sm text-gray-500">Preço por viajante</p>
            <div class="mt-2 text-sm text-gray-500">
              <p>1 adulto: R$ ${preco}</p>
              <p>Impostos e taxas: R$ 229</p>
              <p class="font-bold mt-1 text-gray-700">Preço final: R$ ${(parseFloat(preco.replace(',', '.')) + 229).toFixed(2).replace('.', ',')}</p>
            </div>
          </div>
          <div class="mt-6">
            <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition">Selecionar voo</button>
            <p class="text-xs text-center text-blue-600 mt-2 underline cursor-pointer">Tarifa reembolsável</p>
          </div>
        </div>
      </div>
    `;

    // Adiciona o card
    container.insertAdjacentHTML('beforeend', card);

    // Força o reflow/redraw do DOM
    container.offsetHeight; 
  });

  localStorage.removeItem("resultadosVoos");
});
