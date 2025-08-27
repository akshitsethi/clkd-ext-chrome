// helper.js
// Generate random string (for variable number of characters)
export const randomString = (length, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$_-.') => {
  let result = '';

  for (var i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

// Format date in `yyyy-mm-dd` format
export const formatDate = (date, format = 'normal') => {
  const year = date.getFullYear();
  // Months are 0-indexed, so add 1 and pad with a leading zero if necessary
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  // Pad day with a leading zero if necessary
  const day = String(date.getDate()).padStart(2, '0'); 

  return format === 'normal' ? `${year}-${month}-${day}` : `${day}/${month}`;
};

// Get current tab
export const getCurrentTab = async function() {
	const queryOptions = { active: true };

	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	const [tab] = await chrome.tabs.query(queryOptions);
	return tab;
};
