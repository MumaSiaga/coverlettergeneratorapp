"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";



const inter = Inter({ subsets: ["latin"] });

export default function Home() {
const previewRef = useRef<HTMLDivElement>(null);
const handleDownloadPDF = async () => {
  if (!previewRef.current) return;

  // Make hidden div visible temporarily for capture
  previewRef.current.style.display = "block";

  const canvas = await html2canvas(previewRef.current, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "pt", "a4");
  const pdfWidth = 595;
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  let remainingHeight = pdfHeight;
  let position = 0;
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

  while (remainingHeight > 842) {
    position -= 842;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    remainingHeight -= 842;
  }

  pdf.save("cover_letter.pdf");

  // Hide the div again
  previewRef.current.style.display = "none";
};


  const handleSubmit = async () => {
  if (!cvFile) {
    alert("Please upload your CV");
    return;
  }

  setLoading(true);

  const data = new FormData();
  data.append("cv", cvFile);
  data.append("jobTitle", jobTitle);
  data.append("companyName", companyName);
  data.append("jobDescription", jobDescription);
  data.append("tone", tone);

  try {
    const res = await fetch("https://coverlettergenerator-3m0u.onrender.com/generate", {
      method: "POST",
      body: data,
    });

    const json = await res.json();

    if (res.ok) {
      setGeneratedLetter(json.cover_letter); // <-- update state
    } else {
      alert(json.detail || "Error generating cover letter");
    }
  } catch (err) {
    console.error(err);
    alert("Network or server error");
  } finally {
    setLoading(false);
  }
};

  const [generatedLetter, setGeneratedLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState<"Formal" | "Friendly" | "Confident">("Formal");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  return (
    <div className="bg-gray-100 min-h-screen">
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b">
      <nav className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[24px] text-blue-600">description</span>
          <span className="font-semibold text-lg text-black">
              CoverLetterGen
          </span>
        </div>



        </nav>

    </header>

    <main className="pt-20">
      <h1 className={`text-black font-bold text-4xl ${inter.className} ml-4 mt-8`}>Create your Cover letter</h1>
      <p className={`text-black text-l ${inter.className} ml-4 mt-6`}>Upload your Cv and paste the job description to generate a tailored letter in seconds</p>
      <section className="flex flex-col lg:flex-row gap-8">
        <section className="w-full lg:flex-1 p-4 bg-gray-100">
        
          <form className="flex flex-col gap-4 max-w-md"   onSubmit={(e) => {e.preventDefault();handleSubmit();}}>
            
      
          <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm flex flex-col gap-6">
              <section className="flex gap-2">
        <span className="material-symbols-outlined text-blue-600">work</span>
        <h2 className="text-black font-bold text-l">Job Details</h2>
          </section>
            <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">Job Title</label>
            <input
              type="text"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Software Engineer"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

     
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">Company Name</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Tech Corp"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

    
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700">Job Description</label>
            <textarea
              rows={4}
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-gray-700"
            />
          </div>

          </div>
          
       
          <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-sm flex flex-col gap-6">
       
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                <span className="material-symbols-outlined text-blue-600">upload_file</span>
                Your CV
              </h3>
              <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8">

                {cvFile ? (
                  <>
                    <span className="material-symbols-outlined text-4xl text-blue-600 mb-3">
                      check_circle
                    </span>

                    <p className="text-sm font-semibold text-blue-700 text-center">
                      {cvFile.name}
                    </p>

                    <p className="text-xs text-gray-500 text-center">
                      CV uploaded successfully
                    </p>

                 
                    <button
                      type="button"
                      onClick={() => {
                        setCvFile(null);
                        const input = document.getElementById("cv-upload") as HTMLInputElement;
                        if (input) input.value = "";
                      }}
                      className="mt-3 text-sm text-red-500 hover:underline"
                    >
                      Remove file
                    </button>
                  </>
                ) : (
                  <label
                    htmlFor="cv-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-3">
                      cloud_upload
                    </span>
                    <p className="text-sm font-medium text-center text-gray-800 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-center text-gray-500">
                      PDF, TXT (Max 5MB)
                    </p>
                  </label>
                )}

                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.txt"
                  required
                  className="hidden"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                />
              </div>


            <div>
              <label className="text-sm font-semibold text-gray-800 mb-3 block">Tone of Voice</label>
              <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1.5 rounded-lg">
                              <button
                type="button"
                onClick={() => setTone("Formal")}
                className={`rounded-md py-2 text-sm font-semibold transition-all
                  ${tone === "Formal"
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-900"}
                `}
              >
                Formal
              </button>

              <button
                type="button"
                onClick={() => setTone("Friendly")}
                className={`rounded-md py-2 text-sm font-semibold transition-all
                  ${tone === "Friendly"
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-900"}
                `}
              >
                Friendly
              </button>

              <button
                type="button"
                onClick={() => setTone("Confident")}
                className={`rounded-md py-2 text-sm font-semibold transition-all
                  ${tone === "Confident"
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-900"}
                `}
              >
                Confident
              </button>

              </div>
            </div>

            <button
            
            type="submit" className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-base py-3.5 shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]">
              <span className="material-symbols-outlined">auto_awesome</span>
              Generate Cover Letter
            </button>
          </div>
          </div>
        </form>
 
        </section>
        <section className="w-full lg:flex-[2] p-4 lg:p-8 bg-gray-100">
          
<section className="flex flex-col h-full lg:sticky lg:top-24">

  <div className="flex items-center justify-between mb-4 px-1">
    <h3 className="text-lg font-bold text-gray-900 text-black flex items-center gap-2">
      Preview
    </h3>
    <div className="flex items-center gap-2">
      <button 
      type="button"
      onClick={handleDownloadPDF}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20">
        <span className="material-symbols-outlined text-[18px]">download</span>
        Download PDF
      </button>
    </div>
  </div>

  
  <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-300/50 dark:border-none min-h-[600px] flex flex-col relative overflow-hidden">
    
    <div className="h-1.5 w-full bg-gradient-to-r from-blue-600/80 to-blue-400"></div>

    <div className="absolute inset-0 z-10 bg-white flex flex-col items-start justify-start p-8 text-left overflow-auto text-black">
  {loading ? (
    <p className="text-gray-500">Generating cover letter...</p>
  ) : generatedLetter ? (
    generatedLetter.split("\n").map((line, i) => (
      <p key={i} className="mb-2">
        {line}
      </p>
    ))
  ) : (
    <>
      <div className="mb-6 rounded-full bg-blue-50 p-6 flex items-center justify-center w-full">
        <div className="bg-blue-100 rounded-full p-4">
          <span className="material-symbols-outlined text-4xl text-blue-600">edit_document</span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 w-full text-center">Ready to write?</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-8 text-center">
        Fill in the job details and upload your CV on the left to generate a personalized cover letter instantly.
      </p>
    </>
  )}
</div>

   
    <div className="p-8 sm:p-12 text-gray-900 font-serif leading-relaxed text-lg hidden">
      <p className="mb-4">Dear Hiring Manager,</p>
      <p className="mb-4">
        I am writing to express my strong interest in the Product Manager position at Acme Corp. With over 5 years of experience in product lifecycle management...
      </p>
      
    </div>
 
  </div>


</section>

        
        
       </section>
      </section>
<div
  ref={previewRef}
  className="hidden bg-white"
  style={{
    width: "595px",
    padding: "40px",
    fontFamily: "serif",
    fontSize: "9pt",
    color: "#000000",
    lineHeight: 1.5,
  }}
>
  {generatedLetter && generatedLetter.split("\n").map((line, i) => (
    <p key={i} style={{ margin: "0 0 8px 0" }}>{line}</p>
  ))}
</div>


    </main>
    </div>
    
  );
}
