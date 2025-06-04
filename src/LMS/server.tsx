class LMS {
  async request(params: any): Promise<any> {
    const formData = {
      id: 1,
      method: 'slim.request',
      params,
    };

    const response = await fetch('/jsonrpc.js', {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`LMS request failed: ${response.status}`);
    }

    return response.json();
  }

  getTrack(trackID: number | string): string {
    return `/music/${trackID}/download/.flac`;
  }
}

export { LMS };
