export function floodStatusToIcon(status, options) {
  //Used to toggle characteristics according to flood status
  //options args should be an arr with elements in order [nodata, safe/normal, caution, flooding]
  switch(status) {
    case "Normal":
      return options[1];
    case "Caution":
      return options[2];
    case "Flooding":
      return options[3];
    default:
      return options[0];
  }
}

export function handleErrors(response) {
if (!response.ok) {
    throw Error(response.statusText);
}
return response;
}

function getDistance(firstLocation, secondLocation) {
    const earthRadius = 6371; // km

    const diffLat = (secondLocation[0]-firstLocation[0]) * Math.PI / 180;
    const diffLng = (secondLocation[1]-firstLocation[1]) * Math.PI / 180;

    const arc = Math.cos(
                    firstLocation[0] * Math.PI / 180) * Math.cos(secondLocation[0] * Math.PI / 180)
                    * Math.sin(diffLng/2) * Math.sin(diffLng/2)
                    + Math.sin(diffLat/2) * Math.sin(diffLat/2);
    const line = 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1-arc));

    const distance = (earthRadius * line) / 1.609;

    return distance;
};

export async function addressToCoords(address) {
  address = address.split(" ").join("+");
  let geocodeURL = `https://nominatim.openstreetmap.org/search?street=${address}&state=texas&format=json&polygon=1&addressdetails=1`
  let geocoded = await fetch(geocodeURL).then(data=>data.json())
  return geocoded.length > 0 ? [geocoded[0].lat, geocoded[0].lon] : [29.761, -95.366]
};

export function withinAlertRadius(baseCoords, otherCoords, radiusInMiles = 5) {
  return getDistance(baseCoords, otherCoords) <= radiusInMiles;
};



export function formValidation() {
}


export function checkPhoneNumber(phoneNumber) {
  let errors = [];
  !goodPhoneLength(phoneNumber) && errors.push("Invalid phone number length");
  !isOnlyNumbers(phoneNumber) && errors.push("Invalid phone number");
  return errors
}

export function checkAddress(address) {
  let errors = [];
  !hasNoBadCharacters(address) && errors.push("Address can only contain letters and numbers");
  !goodAddressLength(address) && errors.push("Address is not long enough");
  return errors
}

function goodPhoneLength(someField) {
  return (someField.length >= 10 && someField.length < 11)
}

function goodAddressLength(address) {
  return address.length >= 13 && address.length < 37
}

function hasNoBadCharacters(someField) {
  let addressregex = /^[-\w\s]+$/;
  return addressregex.test(someField)
}

function isOnlyNumbers(someField) {
  let phoneregex = /^[0-9]+$/;
  return someField.match(phoneregex)
}
