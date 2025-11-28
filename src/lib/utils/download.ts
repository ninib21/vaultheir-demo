/**
 * Download utility for investor documents
 */

export const downloadInvestorPitchDeck = async () => {
  const documents = [
    {
      name: '1-EIN-Letter-BidayaX-LLC.pdf',
      url: '/investor-documents/1-EIN-Letter-BidayaX-LLC.pdf',
    },
    {
      name: '2-Vaultheir-Business-Plan.pdf',
      url: '/investor-documents/2-Vaultheir-Business-Plan.pdf',
    },
    {
      name: '3-Vaultheir-Valuation.pdf',
      url: '/investor-documents/3-Vaultheir-Valuation.pdf',
    },
    {
      name: '4-Vaultheir-Investor-Pdf.pdf',
      url: '/investor-documents/4-Vaultheir-Investor-Pdf.pdf',
    },
  ];

  let successCount = 0;
  let failedFiles: string[] = [];

  // Download each document with a slight delay to ensure browser processes them
  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    
    try {
      // Check if file exists first
      const response = await fetch(doc.url, { method: 'HEAD' });
      
      if (!response.ok) {
        failedFiles.push(doc.name);
        console.warn(`File not found: ${doc.name}`);
        continue;
      }

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = doc.name;
      link.style.display = 'none';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      successCount++;
      
      // Small delay between downloads to avoid browser blocking
      if (i < documents.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      failedFiles.push(doc.name);
      console.error(`Failed to download ${doc.name}:`, error);
    }
  }

  // Show user feedback
  if (failedFiles.length === documents.length) {
    alert('⚠️ PDF files not found!\n\nPlease contact support@bidayax.com to receive the investor documents.\n\nThank you for your interest!');
  } else if (failedFiles.length > 0) {
    alert(`✅ Downloaded ${successCount} of ${documents.length} documents.\n\n⚠️ Some files were not available:\n${failedFiles.join('\n')}\n\nPlease contact support@bidayax.com for the missing documents.`);
  } else {
    // Optional success message
    console.log(`✅ Successfully downloaded all ${successCount} documents!`);
  }

  return { successCount, failedFiles };
};

export const downloadSingleDocument = (filename: string) => {
  const link = document.createElement('a');
  link.href = `/investor-documents/${filename}`;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

