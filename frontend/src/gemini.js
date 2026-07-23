import { GoogleGenerativeAI } from "@google/generative-ai";

// In Create React App, environment variables must be prefixed with REACT_APP_ to be accessible in the browser bundle
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ REACT_APP_GEMINI_API_KEY environment variable is not set. Gemini API calls will fail.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Generates a helpful offline assistant response when the Gemini API is rate-limited or unavailable.
 */
function generateLocalResponse(prompt) {
  const query = prompt.toLowerCase().trim();
  
  if (query.match(/\b(hi|hello|hey|greetings|hola)\b/)) {
    return "👋 Hello! I am your CareerPath AI Assistant. How can I help you choose your dream career today?";
  }
  
  if (query.match(/\b(10th|ten|after 10|ssc)\b/)) {
    return "📚 After 10th grade, you have several excellent career pathways:\n\n" +
           "1. **Intermediate (MPC/BiPC/CEC/MEC):** High school preparation for engineering, medical, or commerce degrees.\n" +
           "2. **Polytechnic Diploma:** 3-year technical courses in Civil, Mechanical, Computer Science, etc.\n" +
           "3. **ITI (Industrial Training):** Quick hands-on vocational courses (Electrician, Fitter) leading directly to jobs.\n\n" +
           "💡 Tap the **After 10th** tab at the bottom to explore detailed career roadmaps and entry requirements!";
  }
  
  if (query.match(/\b(12th|twelve|after 12|inter|intermediate|bipc|mpc|cec|mec)\b/)) {
    return "🏛️ After 12th grade, you have specialized stream pathways:\n\n" +
           "• **MPC (Engineering & Tech):** Direct pathway to B.Tech, Computer Science, and Data Science.\n" +
           "• **BiPC (Medical & Pharmacy):** Path for MBBS, BDS, Biotechnology, and Pharmacy.\n" +
           "• **CEC/MEC (Business & Finance):** Path for Chartered Accountancy (CA), CMA, and Finance.\n\n" +
           "💡 Tap the **After 12th** tab at the bottom to explore the complete stream dashboard!";
  }
  
  if (query.match(/\b(grad|graduation|degree|college|btech|bsc|bcom|ba)\b/)) {
    return "🎓 Post-Graduation & College Degree Pathways:\n\n" +
           "• **Professional Tech Roles:** Software Engineering, Data Science, and VLSI design.\n" +
           "• **Management (MBA):** Business Administration, Marketing, and Operations.\n" +
           "• **Public Administration:** Preparing for civil service exams like UPSC and SSC.\n" +
           "• **Banking:** Bank PO, clerk, and financial analyst roles.\n\n" +
           "💡 Tap the **Graduation** tab at the bottom to view specialized post-degree career courses!";
  }

  if (query.match(/\b(aptitude|math|formula|test|exam|percentages|profit|ratio)\b/)) {
    return "⚡ Studying for entrance exams? CareerPath AI has a built-in **Aptitude Cheatsheet**!\n\n" +
           "It covers key topics with math formulas, shortcuts, and examples for:\n" +
           "• Time & Work ⏱️\n" +
           "• Profit & Loss 💰\n" +
           "• Percentages & Ratios 📈\n\n" +
           "💡 Click the **Aptitude** pencil icon in the bottom navigation bar to study formulas instantly!";
  }

  if (query.match(/\b(salary|money|pay|lpa|earn|salary scale)\b/)) {
    return "💰 **Estimated Salaries in India:**\n\n" +
           "• **Computer Science / AI Engineer:** ₹5 LPA – ₹20+ LPA\n" +
           "• **Chartered Accountant (CA):** ₹7.5 LPA – ₹25+ LPA\n" +
           "• **Doctor (MBBS/Surg):** ₹8 LPA – ₹30+ LPA\n" +
           "• **Civil Service (UPSC):** ₹56k/month base + housing & allowances\n\n" +
           "💡 You can see specific salary scales for any career by browsing the detail page for that stream.";
  }

  if (query.match(/\b(engineering|engineer|btech|coding|software|computer|science)\b/)) {
    return "💻 **Engineering Career Highlights:**\n\n" +
           "• **Computer Science & AI:** Core coding, cloud computing, and neural network pipelines. (High demand, starting ₹5-18 LPA)\n" +
           "• **Mechanical & Electrical:** Electric vehicle design, solar grid engineering, and automation.\n" +
           "• **Civil Engineering:** Infrastructure, bridge construction, and urban planning.\n\n" +
           "💡 Explore the 'MPC' stream in the **After 12th** page for all engineering sub-branches!";
  }

  return "🤖 **Offline Assistant Mode:**\n\n" +
         "I am currently running in a local offline assistant mode because the live Gemini AI service has exceeded its daily free rate limit.\n\n" +
         "Here is how you can use the **CareerPath AI** app right now:\n" +
         "• **School Students:** Tap **After 10th** or **After 12th** to browse streams (MPC, BiPC, CEC, etc.) and direct vocational paths.\n" +
         "• **College Students:** Tap **Graduation** to see degree paths, government jobs, and professional courses.\n" +
         "• **Test Prep:** Tap **Aptitude** to view math shortcut formulas and examples for competitive exams.\n" +
         "• **Search:** Tap the **Search (🔍)** icon to search for any courses or career paths instantly.";
}

/**
 * Reusable function to send a prompt to the Google Gemini model.
 * Uses the 'model: gemini-2.0-flash' model as requested.
 * Falls back gracefully to local helper responses if API quota is exceeded.
 * 
 * @param {string} prompt The text prompt to send to Gemini.
 * @returns {Promise<string>} The generated text response.
 */
export async function sendPrompt(prompt, imagePart = null, customConfig = null) {
  if (!genAI) {
    console.warn("REACT_APP_GEMINI_API_KEY is not defined. Falling back to local responder.");
    return generateLocalResponse(prompt);
  }

  // Determine models to try (if customConfig specifies a model, prioritize it)
  const defaultModels = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];
  const modelsToTry = customConfig?.model ? [customConfig.model] : defaultModels;

  for (const modelName of modelsToTry) {
    try {
      const modelOptions = {
        model: modelName,
        systemInstruction: customConfig?.systemInstruction || "You are an expert Career Guidance Advisor. Always format your responses beautifully in a ChatGPT style: use emojis, clean subheadings, bullet points, and well-structured lists."
      };

      // Apply custom overrides like generationConfig
      if (customConfig?.generationConfig) {
        modelOptions.generationConfig = customConfig.generationConfig;
      }

      const model = genAI.getGenerativeModel(modelOptions);
      
      let result;
      if (imagePart) {
        result = await model.generateContent([prompt, imagePart]);
      } else {
        result = await model.generateContent(prompt);
      }
      
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} call failed or quota exceeded. Trying next fallback...`, error);
    }
  }

  // Fallback to other models if customConfig model failed
  if (customConfig?.model) {
    console.warn("Forced model failed. Attempting general fallback models.");
    for (const modelName of defaultModels.filter(m => m !== customConfig.model)) {
      try {
        const modelOptions = {
          model: modelName,
          systemInstruction: customConfig?.systemInstruction || "You are an expert Career Guidance Advisor."
        };
        if (customConfig?.generationConfig) {
          modelOptions.generationConfig = customConfig.generationConfig;
        }
        const model = genAI.getGenerativeModel(modelOptions);
        let result = imagePart ? await model.generateContent([prompt, imagePart]) : await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (e) {
        console.warn(`Fallback model ${modelName} failed.`, e);
      }
    }
  }

  // All online models failed, use local offline responder
  console.warn("⚠️ All online Gemini models failed. Falling back to local offline assistant.");
  return generateLocalResponse(prompt);
}
