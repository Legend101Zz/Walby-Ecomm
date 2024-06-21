export const sendTextToOpenAi = async (
  userText: string,
  language: string,
  showingDroneProduct: boolean,
  userName: string
): Promise<string> => {
  const response = await fetch("/api/openai", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ userText, language, showingDroneProduct, userName }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const { message }: { message: string } = await response.json();
  return message;
};
