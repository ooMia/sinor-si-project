package com.sinor.main.common;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseException extends Exception {
	private BaseResponseStatus status;

	public BaseException(BaseResponseStatus status) {
		super(status.getMessage());
		fillInStackTrace();
		this.status = status;
	}
}
