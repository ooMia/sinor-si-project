package com.sinor.cache.common;

import lombok.Getter;

/**
 * 에러 코드 관리
 */
@Getter
public enum ResponseStatus {
	SUCCESS(true, 200, "요청에 성공하였습니다."),
	INTERNAL_SERVER_ERROR(false, 500, "내부 서버의 오류가 발생했습니다."),

	//캐시 관련
	CACHE_CREATED(true, 201, "캐시 생성에 성공하였습니다."),
	SAVED_CACHE_NOT_FOUND(false, 500, "찾을 수 없는 저장된 캐시를 액세스하려고 합니다."),
	CACHE_LIST_NOT_FOUND(false, 500, "캐시 리스트를 찾을 수 없습니다."),
	CACHE_NOT_FOUND(false, 500, "캐시를 찾을 수 없습니다."),
	CACHE_DELETED_LIST_NOT_FOUND(false, 500, "삭제한 캐시 리스트를 찾을 수 없습니다."),
	CACHE_CREATION_FAILED(false, 500, "캐시 생성를 실패하였습니다."),
	CACHE_DELETION_FAILED(false, 500, "캐시 삭제를 실패하였습니다."),
	CACHE_UPDATE_FAILED(false, 500, "캐시 업데이트를 실패하였습니다."),

	//메타데이터
	INVALID_PARAMETER(false, 400, "path 값을 확인해주세요."),
	METADATA_NOT_FOUND(false, 500, "해당 옵션값이 없습니다."),
	METADATA_CREATION_FAILED(false, 500, "메타데이터 생성를 실패하였습니다."),
	METADATA_ALREADY_EXISTS(false, 500, "메타데이터가 이미 존재합니다."),
	METADATA_FAIR(false, 400, "메타데이터 형식이 잘못되었습니다."),

	//메인 데이터
	MAINDATA_NOT_FOUND(false, 404, "메인 데이터를 찾을 수 없습니다."),

	//인증과인가, 요청처리
	//400 BAD_REQUEST 잘못된 요청
	DESERIALIZATION_ERROR(false, 400, "JSON 형식이 아닙니다."),
	//401 UNAUTHORIZED 인증 실패
	CACHE_UNAUTHORIZED(false, 401, "인증에 실패하였습니다."),
	//403 FORBIDDEN 권한 없음
	ADMIN_ONLY(false, 403, "관리자만 접근 가능합니다."),

	//404 NOT_FOUND 잘못된 리소스 접근
	DISPLAY_NOT_FOUND(false, 404, "페이지 오류입니다."),
	//503 SERVICE_UNAVAILABLE 서비스 이용 불가
	SERVICE_UNAVAILABLE(false, 503, "서비스 이용이 불가합니다.");

	private final boolean isSuccess;
	private final int code;
	private final String message;

	ResponseStatus(boolean isSuccess, int code, String message) {
		this.isSuccess = isSuccess;
		this.code = code;
		this.message = message;
	}
}
