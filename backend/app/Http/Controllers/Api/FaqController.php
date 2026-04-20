<?php
 
namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use App\Models\FaqEntry;
use Illuminate\Http\Request;
 
class FaqController extends Controller
{
    public function index()
    {
        $faqs = FaqEntry::latest()->get();
        return response()->json([
            'success' => true,
            'data' => $faqs,
            'message' => 'FAQs retrieved successfully',
        ]);
    }
 
    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:1000',
            'answer' => 'required|string|max:5000',
            'category' => 'nullable|string|max:100',
            'language' => 'nullable|string|in:en,lt,ru',
        ]);
 
        $faq = FaqEntry::create($validated);
 
        return response()->json([
            'success' => true,
            'data' => $faq,
            'message' => 'FAQ created successfully',
        ], 201);
    }
 
    public function update(Request $request, $id)
    {
        $faq = FaqEntry::findOrFail($id);
 
        $validated = $request->validate([
            'question' => 'sometimes|string|max:1000',
            'answer' => 'sometimes|string|max:5000',
            'category' => 'nullable|string|max:100',
            'language' => 'nullable|string|in:en,lt,ru',
        ]);
 
        $faq->update($validated);
 
        return response()->json([
            'success' => true,
            'data' => $faq,
            'message' => 'FAQ updated successfully',
        ]);
    }
 
    public function destroy($id)
    {
        $faq = FaqEntry::findOrFail($id);
        $faq->delete();
 
        return response()->json([
            'success' => true,
            'message' => 'FAQ deleted successfully',
        ]);
    }
}
