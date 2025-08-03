const axios = require('axios');
const xlsx = require('xlsx');

// This function is unchanged
const processNumberList = (inputArray) => {
  const activeNumbers = new Set();
  const wrongNumbers = new Set();
  const numberRegex = /^\d{10}$/;
  inputArray.forEach(item => {
    const trimmedItem = String(item).trim();
    if (numberRegex.test(trimmedItem)) {
      activeNumbers.add(trimmedItem);
    } else {
      if(trimmedItem) wrongNumbers.add(trimmedItem);
    }
  });
  const activeList = Array.from(activeNumbers);
  const totalSubmitted = inputArray.length;
  const duplicates = totalSubmitted - activeList.length - wrongNumbers.size;
  return {
    totalSubmitted,
    activeList,
    totalActive: activeList.length,
    totalWrong: wrongNumbers.size,
    totalDuplicates: duplicates < 0 ? 0 : duplicates,
  };
};

// ✅ This function is now updated to validate all email formats
const processEmailList = (inputArray) => {
  const activeEmails = new Set();
  const wrongEmails = new Set();
  let totalSubmitted = 0;
  // This is a standard regex to check for a valid email structure
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  inputArray.forEach(item => {
    // Find all potential email-like strings in the text
    const emailsFound = String(item).match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g) || [];
    totalSubmitted += emailsFound.length;

    emailsFound.forEach(emailStr => {
      const lowercasedEmail = emailStr.toLowerCase().trim();
      // Test the found email against the regex
      if (emailRegex.test(lowercasedEmail)) {
        activeEmails.add(lowercasedEmail);
      } else {
        wrongEmails.add(emailStr);
      }
    });
  });
  const activeList = Array.from(activeEmails);
  const duplicates = totalSubmitted - activeList.length - wrongEmails.size;
  return {
    totalSubmitted,
    activeList,
    totalActive: activeList.length,
    totalWrong: wrongEmails.size,
    totalDuplicates: duplicates < 0 ? 0 : duplicates,
  };
};

// This function is unchanged
exports.uploadText = (req, res) => {
  try {
    const { notepadText, type } = req.body;
    if (!notepadText) return res.status(400).json({ message: 'No text provided.' });
    const rawInput = notepadText.split(/[\s,]+/);
    let result = (type === 'emails') ? processEmailList(rawInput) : processNumberList(rawInput);
    result.type = type;
    res.status(200).json({ message: 'Data processed successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error processing text' });
  }
};

// This function is unchanged
exports.uploadFile = async (req, res) => {
  try {
    const { type } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }
    const file = req.files[0];
    let result;
    if (file) {
      const response = await axios.get(file.path, { responseType: 'arraybuffer' });
      const buffer = response.data;
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      const rawInput = data.flat().filter(cell => cell != null);
      result = (type === 'emails') ? processEmailList(rawInput) : processNumberList(rawInput);
      result.type = type;
    }
    res.status(200).json({ message: 'File processed successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing files' });
  }
};

// This function is unchanged
exports.uploadImageFromEditor = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }
    res.status(200).json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image.' });
  }
};