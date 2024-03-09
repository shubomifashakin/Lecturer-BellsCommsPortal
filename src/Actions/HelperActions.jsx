export const emailEmpty = "Please enter your email";
export const passwordEmpty = "Please enter your password";
export const valEmpty = "Please enter your password";
export const invalidPassword =
  "Must contain uppercase & lowercase letters and a number";
export const passwordsNotMatch = "Passwords do not match";

export function SortArrayBasedOnLetters(arr) {
  return arr.sort((a, b) => {
    // Convert both strings to lowercase to ensure case-insensitive sorting
    let stringA = a.toLowerCase();
    let stringB = b.toLowerCase();

    if (stringA < stringB) {
      return -1; // If stringA should come before stringB, return a negative value
    }
    if (stringA > stringB) {
      return 1; // If stringA should come after stringB, return a positive value
    }
    return 0; // If stringA and stringB are equal
  });
}

export function SortArrayBasedOnCreatedAt(arr) {
  return arr.sort((a, b) => {
    // Convert the 'created_at' strings to Date objects for comparison
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    // Compare the dates
    if (dateA < dateB) {
      return -1; // dateA is older
    }

    if (dateA > dateB) {
      return 1; // dateA is newer
    }
    return 0; // dates are equal
  });
}

export function FormatTime(time, style = "short") {
  return Intl.DateTimeFormat(navigator.language, {
    dateStyle: style,
  }).format(new Date(time));
}
