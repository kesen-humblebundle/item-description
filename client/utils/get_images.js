import axios from "axios";

// Note: Image API won't work temporarily due to localhost development & lack of EC2 instance availability. Leaving code as is for now.

export const getImages = async () => {
  return ['https://sdc-kesen-images.s3.us-east-2.amazonaws.com/desktop/description.png'];
};
