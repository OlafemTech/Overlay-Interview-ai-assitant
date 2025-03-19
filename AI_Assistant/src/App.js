import { useState, useEffect } from "react"; 
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff } from "lucide-react";

export default function AIHelper() {
  const [aiResponse, setAIResponse] = useState("Hello! I'm here to assist you.");
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!listening && transcript) {
      handleAIResponse(transcript);
    }
  }, [listening]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
    setIsListening(true);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
  };

  const handleAIResponse = async (query) => {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_OPENAI_API_KEY`,
      },
      body: JSON.stringify({ model: "gpt-4", prompt: query, max_tokens: 100 }),
    });
    const data = await response.json();
    setAIResponse(data.choices[0].text.trim());
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 w-96 bg-white shadow-lg rounded-xl border">
      <Card>
        <CardContent className="p-4">
          <p className="font-bold">AI Assistant</p>
          <p className="text-gray-600">{aiResponse}</p>
          <div className="flex items-center gap-2 mt-4">
            <Input
              type="text"
              placeholder="Type a question..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAIResponse(e.target.value);
              }}
            />
            <Button onClick={isListening ? stopListening : startListening}>
              {isListening ? <MicOff /> : <Mic />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}