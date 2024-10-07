import { Response, NextFunction } from 'express';
import createError from 'http-errors';

export class retMiddleware {
  private code: number = 0;
  private body: any = null;
  constructor() {}
  public getCode(): number {
    return this.code;
  }
  public getBody(): any {
    return this.body;
  }
  public setCode(code: number): void {
    this.code = code;
  }
  public setBody(body: any): void {
    this.body = body;
  }
  public setResponse(code: number, body: any): void {
    this.setBody(body);
    this.setCode(code);
  }
  public returnError(next: NextFunction) {
    next(createError(this.code, this.body));
  }
  public returnNext(next: NextFunction) {
    if (this.code >= 400) {
      this.returnError(next);
    } else {
      next();
    }
  }
  public returnResponseJson(res: Response, next: NextFunction) {
    if (this.code >= 400) {
      this.returnError(next);
    } else {
      res.status(this.code).json(this.body);
    }
  }
}
