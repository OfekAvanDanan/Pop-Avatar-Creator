// Centralized Webpack contexts for avatar assets
// Keep arguments literal so Webpack includes files statically
import '../polyfills/requireContext';

export const faceCtx = require.context('../Assets/AvatarAssets/2_Face', false, /\.\/Face_\d+\.svg$/);
export const hair0Ctx = require.context('../Assets/AvatarAssets/1_Hair_0', false, /\.\/Hair_\d{3}_0\.svg$/);
export const hair1Ctx = require.context('../Assets/AvatarAssets/14_Hair_1', false, /\.\/Hair_\d{3}_1\.svg$/);
export const clothing0Ctx = require.context('../Assets/AvatarAssets/4_Clothing_0', false, /\.\/Clothing_\d+_0\.svg$/);
export const clothing1Ctx = require.context('../Assets/AvatarAssets/9_Clothing_1', false, /\.\/Clothing_\d+_1\.svg$/);
export const faceTextureCtx = require.context('../Assets/AvatarAssets/5_FaceTexture', false, /\.\/FaceTexture_\d+\.svg$/);
export const centerClothingCtx = require.context('../Assets/AvatarAssets/6_Center_Clothing', false, /\.\/CenterClothing_\d+\.svg$/);
export const rightClothingCtx = require.context('../Assets/AvatarAssets/7_Right_Clothing', false, /\.\/RightClothing_\d+\.svg$/);
export const leftClothingCtx = require.context('../Assets/AvatarAssets/8_Left_Clothing', false, /\.\/LeftClothing_\d+\.svg$/);
export const glassesCtx = require.context('../Assets/AvatarAssets/13_Glasses', false, /\.\/Glasses_\d+\.svg$/);

