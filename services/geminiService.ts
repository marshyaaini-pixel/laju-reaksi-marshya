import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing!");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const askChemistryTutor = async (
  question: string,
  context: string
): Promise<string> => {
  try {
    const ai = getClient();
    const systemPrompt = `
      Anda adalah guru kimia yang ramah dan ahli dalam materi Laju Reaksi untuk siswa SMA kelas 11.
      Jawablah pertanyaan siswa dengan ringkas, jelas, dan memotivasi.
      Gunakan konteks materi berikut jika relevan: ${context}
      Jangan berikan jawaban kuis secara langsung, tapi bimbing siswa untuk menemukannya.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "Maaf, saya sedang mengalami gangguan koneksi.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, fitur tanya jawab sedang tidak tersedia. Pastikan API Key valid.";
  }
};

export const analyzeStudentPerformance = async (
  results: any[]
): Promise<string> => {
  try {
    const ai = getClient();
    const dataStr = JSON.stringify(results);
    const prompt = `
      Berikut adalah data hasil kuis siswa dalam format JSON: ${dataStr}.
      Berikan analisis singkat (maksimal 2 paragraf) untuk guru mengenai area mana yang siswa sudah paham dan mana yang perlu diulang.
      Fokus pada materi 'Konsep Laju Reaksi' dan 'Faktor Laju Reaksi'.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Tidak dapat menghasilkan analisis saat ini.";
  } catch (error) {
    console.error(error);
    return "Analisis AI tidak tersedia.";
  }
};
