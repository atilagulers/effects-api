const file = document.getElementById('file').files[0];
const preSignedUrl = 'https://example.com/presigned-url';

const putObject = async () => {
  try {
    const response = await fetch(preSignedUrl, {
      method: 'PUT',
      body: file,
    });
    console.log(response.status);
  } catch (error) {
    console.error(error);
  }
};
