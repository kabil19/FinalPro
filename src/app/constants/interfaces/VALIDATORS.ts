
/* 
phoneNumberPattern->
This regex ensures that the string starts with an optional plus sign 
followed by one or more digits, allowing for strings 
like +123 and 123, but disallowing any other symbols or characters.
*/

export const phoneNumberPattern = /^\+?[0-9]+$/;


/* 
namePattern->
This regex ensures that the string consists entirely of alphabetic
 characters, with no symbols, numbers, or other characters allowed.
  It will match names like John, Alice, Emily, and Alexander.

*/
export const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

/* 
addressPattern->

Can start with an optional #.
Includes letters, digits, periods, commas, and spaces.
Cannot be composed entirely of numbers.
Examples of valid addresses:

123 Main St.
#456 Elm St.
Apartment 7, Building B
Main St. 123
Examples of invalid addresses:

12345 (only numbers)
# (only special character without any alphanumeric characters)
*/
export const addressPattern = /^(#?[a-zA-Z0-9.,\s]*[a-zA-Z][a-zA-Z0-9.,\s]*|[a-zA-Z][a-zA-Z0-9.,\s]*)$/;


/* 
passwordPattern->
for a password that must contain at least one letter and one digit,
 with only letters and digits allowed. Here's a breakdown of this regex:
 Valid Examples:
password123 - Contains both letters and digits.
abc1def2 - Contains both letters and digits.
123abc - Contains both letters and digits.
*/
export const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+=\-{}[\]:;"'<>,.?\/~`|\\]+$/;



/* 
emailPattern->
This pattern will validate emails like:

example@example
user.name@domain.com
user123@sub.domain.info
*/
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/;



/*
userNamePattern->
Contains only letters, digits, and underscores.
Cannot be composed entirely of digits.
 */
export const userNamePattern = /^(?!^\d+$)[a-zA-Z0-9_]+$/;
export const nonMinusDigitPattern = /^(?!-)\d+(\.\d{1,2})?$/
export const discountPattern = /^[0-9.%]+$/
export const netAmountPattern = /^(?!0(\.0+)?$)(\d+(\.\d+)?|\.\d+)$/
export const percentagePattern = /^(100|[1-9]?[0-9])%$/
export const nonMinusnonZeroDigitPattern = /^(?!-)(?!0$)\d+(\.\d{1,2})?$/;


/* 
ItemName->
valids:
123Item
1-Item_name
2024 Item
9_Test-Item
Pillow_6X

Invalid Examples:
Item123 (starts with a space)
' ' (only spaces)
 item-name (starts with a space)
Test-Item (starts with a space)
*/
export const itemNamePattern = /^(?! )[a-zA-Z0-9-_ ]*(?<! )$/