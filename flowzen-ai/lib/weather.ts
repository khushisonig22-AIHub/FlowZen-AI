import axios from "axios"

export interface WeatherData {
  temp: number
  condition: string
  icon: string
  description: string
  recommendation: string
}

const mockWeatherData = [
  { temp: 32, condition: "Sunny", icon: "☀️", description: "Clear sky", recommendation: "Great weather - Enjoy!" },
  { temp: 28, condition: "Cloudy", icon: "⛅", description: "Partly cloudy", recommendation: "Cloudy - Any gate is fine" },
  { temp: 25, condition: "Rainy", icon: "🌧️", description: "Light rain", recommendation: "Rain expected - Use covered exits" },
  { temp: 24, condition: "Stormy", icon: "⛈️", description: "Thunderstorm", recommendation: "Severe weather - Use nearest exit" },
]

export async function getWeather(location: string = "Delhi"): Promise<WeatherData> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
    
    if (!apiKey || apiKey === "demo_key") {
      // Return mock data in development
      return mockWeatherData[Math.floor(Math.random() * mockWeatherData.length)]
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    )

    const data = response.data
    const temp = Math.round(data.main.temp)
    const condition = data.weather[0].main
    const description = data.weather[0].description

    let icon = "☀️"
    let recommendation = ""

    if (condition.includes("Rain")) {
      icon = "🌧️"
      recommendation = "Rain expected - Use covered exits"
    } else if (condition.includes("Cloud")) {
      icon = "⛅"
      recommendation = "Cloudy - Any gate is fine"
    } else if (condition.includes("Storm") || condition.includes("Thunder")) {
      icon = "⛈️"
      recommendation = "Severe weather - Use nearest exit"
    } else {
      icon = "☀️"
      recommendation = temp > 35 ? "High temp - Seek shade at Gate A" : "Great weather - Enjoy!"
    }

    return { temp, condition, icon, description, recommendation }
  } catch (error) {
    console.error("Weather API error:", error)
    return mockWeatherData[0]
  }
}

export function getWeatherBasedRecommendation(
  weather: WeatherData,
  crowdLevel: number,
  gates: { name: string; crowd: number }[]
): string {
  const highCrowd = crowdLevel > 80
  const rainy = weather.condition.includes("Rain")
  const stormy = weather.condition.includes("Storm") || weather.condition.includes("Thunder")
  const hot = weather.temp > 35

  if (stormy) {
    return "⚠️ EMERGENCY - Use nearest exit immediately"
  }

  const bestGate = gates.reduce((best, gate) => (gate.crowd < best.crowd ? gate : best))

  let message = `✅ Recommended: ${bestGate.name} (${bestGate.crowd}% crowd)`

  if (rainy && bestGate.crowd < 70) {
    message += " - Covered exit"
  }
  if (hot && bestGate.name === "Gate A") {
    message += " - Has water stations"
  }

  if (highCrowd) {
    message = `⚠️ HIGH CROWD - ${message}`
  }

  return message
}
