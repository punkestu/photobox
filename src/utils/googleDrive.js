export const postImage = async (images, credential) => {
  const folderName = "PhotoboxMicroapesTest";

  let folder = await checkFolder(folderName, credential);
  if (folder.length == 0) {
    await createFolder(folderName, credential);
    folder = await checkFolder(folderName, credential);
  }

  let customerID = crypto.randomUUID();
  let folderCustomer = await checkFolder(
    `cust_${customerID}`,
    credential,
    folder[0].id,
  );
  while (folderCustomer.length > 0) {
    customerID = crypto.randomUUID();
    folderCustomer = await checkFolder(
      `cust_${customerID}`,
      credential,
      folder[0].id,
    );
  }
  if (folderCustomer.length == 0) {
    await createFolder(`cust_${customerID}`, credential, folder[0].id);
    folderCustomer = await checkFolder(
      `cust_${customerID}`,
      credential,
      folder[0].id,
    );
    await makeFolderPublic(folderCustomer[0].id, credential);
  }

  await Promise.all(
    images.map((image, index) => {
      return createImage(
        urlToFile(image, `image_${index}.png`),
        credential,
        folderCustomer[0].id,
      );
    }),
  );

  return `https://drive.google.com/drive/folders/${folderCustomer[0].id}`;
};

async function checkFolder(folderName, credential, folderId = null) {
  const query = encodeURIComponent(
    (folderId ? `'${folderId}' in parents and ` : "") +
      `mimeType='application/vnd.google-apps.folder' and ` +
      `name='${folderName}' and trashed=false`,
  );
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}`,
    {
      headers: {
        Authorization: "Bearer " + credential,
      },
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return (await res.json()).files;
}

async function createFolder(folderName, credential, folderId = null) {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files`, {
    body: JSON.stringify({
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [folderId],
    }),
    headers: {
      Authorization: "Bearer " + credential,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return await res.json();
}

async function createImage(imageFile, credential, folderId) {
  const metadata = {
    name: imageFile.name,
    ...(folderId ? { parents: [folderId] } : {}),
  };
  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    }),
  );
  form.append("file", imageFile);
  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${credential}`,
      },
      body: form,
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return await res.json();
}

async function makeFolderPublic(folderId, credential) {
  await fetch(
    `https://www.googleapis.com/drive/v3/files/${folderId}/permissions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${credential}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "reader", // 👀 view only
        type: "anyone", // 🌍 public internet
      }),
    },
  );
}

function urlToFile(dataUrl, fileName) {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "";

  const binary = atob(base64);
  const len = binary.length;

  const buffer = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    buffer[i] = binary.charCodeAt(i);
  }

  return new File([new Blob([buffer], { type: mime })], fileName, {
    type: mime,
  });
}
