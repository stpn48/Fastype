// import { catchError } from "@/lib/catch-error";
// import { prisma } from "@/lib/prisma";

// export async function replaceQuotes() {
//   const [raceTexts, raceTextsError] = await catchError(prisma.raceText.findMany());

//   console.log(raceTexts);

//   if (raceTextsError || !raceTexts) {
//     return;
//   }

//   for (const raceText of raceTexts) {
//     let text = raceText.text;
//     console.log(raceText.text);

//     // Replace special quotes with normal quotes
//     text = text
//       .replace(/[“”]/g, '"') // Replace left and right double quotes with "
//       .replace(/[‘’]/g, "'"); // Replace left and right single quotes with '

//     console.log(text);

//     await catchError(
//       prisma.raceText.update({
//         where: {
//           id: raceText.id,
//         },
//         data: {
//           text: text,
//         },
//       }),
//     );
//   }
// }
