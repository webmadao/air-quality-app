const pollutionScale = [
    {
      scale: [0, 50],
      quality: "Good",
      src: "happy",
      background: "linear-gradient(to right, #45B649, #DCE35B)",
    },
    {
      scale: [51, 100],
      quality: "Moderate",
      src: "thinking",
      background: "linear-gradient(to right, #F3F9A7, #CAC531)",
    },
    {
      scale: [101, 150],
      quality: "Unhealthy",
      src: "unhealthy",
      background: "linear-gradient(to right, #F16529, #E44D26)",
    },
    {
      scale: [151, 200],
      quality: "Bad",
      src: "bad",
      background: "linear-gradient(to right, #ef473a, #cb2d3e)",
    },
    {
      scale: [201, 300],
      quality: "Very bad",
      src: "mask",
      background: "linear-gradient(to right, #8E54E9, #4776E6)",
    },
    {
      scale: [301, 500],
      quality: "Terrible",
      src: "terrible",
      background: "linear-gradient(to right, #7a2828, #a73737)",
    },
  ];

  const loader = document.querySelector(".loader");
  const emojiLogo = document.querySelector(".emoji-logo");
  const userInformation = document.querySelector(".user-information");

  async function getPollutionData() {
    try {
      const response = await fetch("http://api.airvisual.com/v2/nearest_city?key=73eb6caa-a8da-4730-8fc7-3b302bc2188d").catch(error => {
        throw new Error(error);
      });
      
      if(!response.ok){
        throw new Error("Error ${response.status}, ${response.statusText}");
      }
  
      const responseData = await response.json();
      const aqi = responseData.data.current.pollution.aqius;
      console.log(aqi);
      const sortedData = {
        city: responseData.data.city,
        aqi,
        ...pollutionScale.find(obj => aqi >= obj.scale[0] && aqi <= obj.scale[1])
      };
      populateUI(sortedData);
  
    } catch (error) {
      loader.classList.remove("active");
      emojiLogo.src = "ressources/browser.svg";
      userInformation.textContent = error.message;
    }
  }
  
  getPollutionData();
  

  const cityName = document.querySelector(".city-name");
  const pollutionInfo = document.querySelector(".pollution-info");
  const pollutionValue = document.querySelector(".pollution-value");
  const backgroundLayer = document.querySelector(".background-layer");

  function populateUI(data){
    emojiLogo.src = `ressources/${data.src}.svg`;
    userInformation.textContent = `Here is ${data.city} situation`;
    cityName.textContent = data.city;
    pollutionInfo.textContent = data.quality;
    pollutionValue.textContent = data.aqi;
    backgroundLayer.style.background = data.background;
    loader.classList.remove("active");

    pointerPlacement(data.aqi);
  }

  const locationPointer = document.querySelector(".location-pointer");

  function pointerPlacement(AQIValue){
    const parentWidth = locationPointer.parentElement.scrollWidth;
    locationPointer.style.transform = `translateX(${(AQIValue / 500) * parentWidth}px) rotate(180deg)`;
  }