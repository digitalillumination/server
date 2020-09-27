import ExposableError from "../../classes/ExposableError";

export const InternalServerError = new ExposableError("서버에서 에러가 발생했습니다.", "SERVER_ERROR", 500);
export function validateError(message: string = "잘못된 요청입니다.") {
    return new ExposableError(message, "VALIDATE_ERROR", 400);
}