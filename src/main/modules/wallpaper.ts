export async function getWallpaperPath() {
  const { getWallpaper } = await import('wallpaper');
  try {
    return await getWallpaper();
  } catch {
    return '';
  }
}
