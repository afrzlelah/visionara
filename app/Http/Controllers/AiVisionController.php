<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiVisionController extends Controller
{
    /**
     * Analyze an image using Google Gemini API.
     */
    public function analyze(Request $request)
    {
        $request->validate([
            'image' => 'required|string',
        ]);

        $apiKey = config('services.gemini.key');

        if (! $apiKey) {
            return response()->json([
                'error' => 'API Key for Gemini is missing. Please configure it in your .env file.',
            ], 500);
        }

        try {
            // Extract the base64 string from the data URL
            // Format is typically "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
            $imageDataUrl = $request->input('image');
            $exploded = explode(',', $imageDataUrl);

            if (count($exploded) < 2) {
                return response()->json(['error' => 'Invalid image format.'], 400);
            }

            $base64Data = $exploded[1];
            
            // Extract mime type from the data URL
            preg_match('/^data:(image\/[a-zA-Z+]+);base64,/', $exploded[0] . ',', $matches);
            $mimeType = $matches[1] ?? 'image/jpeg';

            // Send request to Google Gemini API
            $response = Http::withoutVerifying()
                ->timeout(30)
                ->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $apiKey, [
                'contents' => [
                    [
                        'parts' => [
                            [
                                'text' => "Anda adalah asisten AI yang membantu penyandang tunanetra. Deskripsikan keadaan di sekitar dalam gambar ini dengan sangat jelas, singkat, ramah, dan sangat membantu. Fokus pada objek penting, orang, posisi mereka, atau kemungkinan rintangan. Gunakan bahasa Indonesia yang natural untuk diucapkan. Maksimal 3 kalimat singkat."
                            ],
                            [
                                'inline_data' => [
                                    'mime_type' => $mimeType,
                                    'data' => $base64Data,
                                ]
                            ]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // Extract the text from the Gemini response structure
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    $text = $data['candidates'][0]['content']['parts'][0]['text'];
                    return response()->json(['description' => $text]);
                }
            }

            Log::error('Gemini API Error', ['response' => $response->body()]);

            return response()->json([
                'error' => 'Failed to analyze the image with AI.',
                'details' => $response->json()
            ], 500);

        } catch (\Exception $e) {
            Log::error('AI Vision Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred while analyzing the image.',
            ], 500);
        }
    }
}
