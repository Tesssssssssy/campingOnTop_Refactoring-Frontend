function base64UrlDecode(str) {
    try {
        // Base64 URL -> Base64 변환 (Base64 URL은 URL-safe를 위해 + -> - 와 / -> _ 등으로 변환됨)
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        // Base64 디코딩
        let decodedStr = decodeURIComponent(escape(window.atob(str)));
        return JSON.parse(decodedStr);
    } catch (e) {
        console.error("Failed to decode base64 string:", e);
        return null;
    }
}

// VueJwtDecode.decode() 대신에 custom decode 사용
export function customJwtDecode(token) {
    const base64Url = token.split('.')[1];
    return base64UrlDecode(base64Url);
}
