export default function matchMedia(media: string) {
  return window.matchMedia(media.replace("@media", ""));
}
