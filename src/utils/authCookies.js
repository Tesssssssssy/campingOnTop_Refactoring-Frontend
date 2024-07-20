// 로그인 성공 후 토큰을 쿠키에 저장하는 함수
export function setTokenCookies(accessToken, refreshToken) {
    const hour = 3600000; // 밀리초 단위로 1시간
    const week = hour * 24 * 7; // 밀리초 단위로 1주일

    // document.cookie = `accessToken=${accessToken}; path=/; max-age=${hour}; Secure; SameSite=Strict`; // Secure 플래그는 HTTPS에서만 (이것 때문에 배포 후 쿠키 저장 안됨!)
    // document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${week}; Secure; SameSite=Strict`;

    document.cookie = `accessToken=${accessToken}; path=/; max-age=${hour}; SameSite=Strict`;
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${week}; SameSite=Strict`;
}

// 쿠키에서 토큰을 추출하는 함수
export function getTokenFromCookie(name) {
    // Simplify the regex by removing unnecessary escapes
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// 로그아웃시 쿠키에서 토큰 삭제
export function deleteTokenCookies() {
    document.cookie = "accessToken=; path=/; max-age=-1";
    document.cookie = "refreshToken=; path=/; max-age=-1";
}