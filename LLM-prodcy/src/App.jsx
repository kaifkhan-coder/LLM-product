import { useState } from "react";
import { generateProductContent } from "./services/openrouter";
function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });
};

const handleGenerate = async () => {
  if (!title && !description && !image) {
    alert("Please provide image, title or description");
    return;
  }

  try {
    setLoading(true);

let base64Image = "";

if (image) {
  base64Image = await convertToBase64(image);
}

const aiResult = await generateProductContent({
  title,
  description,
  image: base64Image
});

    setResult(aiResult);

  } catch (error) {
    console.error(error);
    alert("Failed to generate AI content");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-8">

      {/* CONTAINER */}
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            eCommerce Content AI
          </h1>

          <p className="text-gray-400 mt-3">
            Generate product title, description, pricing,
            summary and features using LLM.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT PANEL */}
          <div className="bg-[#1E293B] rounded-3xl p-8 border border-gray-700">

            <h2 className="text-2xl font-semibold mb-6">
              Product Input
            </h2>

            {/* TITLE */}
            <div className="mb-5">
              <label className="block mb-2 text-gray-300">
                Product Title
              </label>

              <input
                type="text"
                placeholder="Enter product title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0F172A] border border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-5">
              <label className="block mb-2 text-gray-300">
                Product Description
              </label>

              <textarea
                rows="5"
                placeholder="Enter product description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#0F172A] border border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* IMAGE */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-300">
                Upload Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full bg-[#0F172A] border border-gray-600 rounded-xl p-3"
              />
            </div>

            {/* IMAGE PREVIEW */}
            {image && (
              <div className="mb-6">
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-full h-64 object-cover rounded-2xl border border-gray-700"
                />
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-4 rounded-2xl font-semibold text-lg"
            >
              {loading ? "Generating..." : "Generate AI Content"}
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-[#1E293B] rounded-3xl p-8 border border-gray-700">

            <h2 className="text-2xl font-semibold mb-6">
              Generated Output
            </h2>

            {!result ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-lg">
                AI generated product content will appear here.
              </div>
            ) : (
              <div className="space-y-6">

                {/* TITLE */}
                <div>
                  <h3 className="text-gray-400 mb-1">
                    Generated Title
                  </h3>

                  <p className="text-3xl font-bold">
                    {result.title}
                  </p>
                </div>

                {/* SUMMARY */}
                <div>
                  <h3 className="text-gray-400 mb-1">
                    Summary
                  </h3>

                  <p className="text-gray-200">
                    {result.summary}
                  </p>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <h3 className="text-gray-400 mb-1">
                    Description
                  </h3>

                  <p className="text-gray-200 leading-7">
                    {result.description}
                  </p>
                </div>

                {/* PRICES */}
                <div className="grid grid-cols-2 gap-5">

                  <div className="bg-[#0F172A] p-5 rounded-2xl border border-gray-700">
                    <p className="text-gray-400 mb-2">
                      MRP
                    </p>

                    <h4 className="text-3xl font-bold">
                      {result.mrp}
                    </h4>
                  </div>

                  <div className="bg-[#0F172A] p-5 rounded-2xl border border-gray-700">
                    <p className="text-gray-400 mb-2">
                      Selling Price
                    </p>

                    <h4 className="text-3xl font-bold text-green-400">
                      {result.sellingPrice}
                    </h4>
                  </div>
                </div>

                {/* FEATURES */}
<div>
  <h3 className="text-gray-400 mb-3">
    Key Features
  </h3>

  <div className="flex flex-col gap-3">

    {result.features.map((feature, index) => (

      <div
        key={index}
        className="bg-blue-600/20 border border-blue-500 p-4 rounded-xl"
      >

        <h4 className="font-semibold text-white">
          {feature.name}
        </h4>

        <p className="text-gray-300 text-sm mt-1">
          {feature.description}
        </p>
        <div>
  <h3 className="text-gray-400">Category</h3>
  <p>{result.category}</p>
</div>
<div>
  <h3 className="text-gray-400">Brand</h3>
  <p>{result.brandSuggestion}</p>
</div>
<div>
  <h3 className="text-gray-400">Discount</h3>
  <p>{result.discountPercentage}</p>
</div>
<div>
  <h3 className="text-gray-400">Rating</h3>
  <p>⭐ {result.rating}</p>
</div>
<div>
  <h3 className="text-gray-400 mb-2">
    Key Highlights
  </h3>

  <div className="flex flex-wrap gap-2">
    {result.keyHighlights.map((item, index) => (
      <div
        key={index}
        className="bg-green-600/20 border border-green-500 px-3 py-2 rounded-full"
      >
        {item}
      </div>
    ))}
  </div>
</div>
<div>
  <h3 className="text-gray-400 mb-3">
    Specifications
  </h3>

  <div className="grid grid-cols-2 gap-4">

    {Object.entries(result.specifications).map(
      ([key, value]) => (

        <div
          key={key}
          className="bg-[#0F172A] p-3 rounded-xl"
        >
          <p className="text-gray-400 text-sm capitalize">
            {key}
          </p>

          <p className="text-white">
            {value}
          </p>
        </div>
      )
    )}
    <div>
  <h3>Category</h3>
  <p>{result.category}</p>
</div>

<div>
  <h3>Brand</h3>
  <p>{result.brandSuggestion}</p>
</div>
    </div>
    <div className="bg-[#0F172A] p-5 rounded-xl">
  <h3 className="text-xl font-bold mb-3">
    SEO Title
  </h3>

  <p>{result.seoTitle}</p>
</div>

<div className="bg-[#0F172A] p-5 rounded-xl">
  <h3 className="text-xl font-bold mb-3">
    SEO Description
  </h3>

  <p>{result.seoDescription}</p>
</div>
<div>
  <h3 className="mb-3 text-gray-400">
    SEO Keywords
  </h3>

  <div className="flex flex-wrap gap-2">

    {result.keywords?.map((keyword, index) => (
      <span
        key={index}
        className="bg-purple-600/20 border border-purple-500 px-3 py-2 rounded-full"
      >
        {keyword}
      </span>
    ))}

  </div>
</div>
<div>
  <h3 className="mb-3 text-gray-400">
    Amazon Bullet Points
  </h3>

  <ul className="list-disc pl-5 space-y-2">

    {result.amazonBulletPoints?.map((item, index) => (
      <li key={index}>
        {item}
      </li>
    ))}

  </ul>
</div>
<div className="bg-[#0F172A] p-4 rounded-xl">
  <h3 className="text-gray-400">
    Stock Status
  </h3>

  <p className="text-green-400 font-bold">
    {result.stockStatus}
  </p>
</div>
<div className="bg-[#0F172A] p-4 rounded-xl">
  <h3 className="text-gray-400">
    Warranty
  </h3>

  <p>
    {result.warranty}
  </p>
</div>

</div>
      </div>
      
    ))}

  </div>
</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="text-center text-gray-500 mt-10">
  © 2026 Kaif Khan | AI Ecommerce Product Generator
</footer>
    </div>
  );
}

export default App;