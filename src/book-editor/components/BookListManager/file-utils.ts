type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [prop: string]: Json };

export function saveData(data: Json, fileName: string): void {
  const a = document.getElementById("download") as HTMLAnchorElement;
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "octet/stream" });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function readAsText(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onerror = (e) => rej(new Error("Failed to read file as text."));
    reader.onload = () => {
      if (typeof reader.result === "string") {
        res(reader.result);
      } else {
        rej(
          new Error(
            `Result of reading file as text is ${
              reader.result === null ? "null" : "an ArrayBuffer"
            }.`
          )
        );
      }
    };
  });
}
