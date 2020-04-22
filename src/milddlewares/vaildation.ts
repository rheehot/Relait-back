import * as express from "express";
import * as jwt from "jsonwebtoken";
import { decryptJwt, JwtPayload, Jwt } from "../lib/helper";

export const hasValidLoginBody = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): express.Response | void => {
  const { uniqueId, vender } = req.body;
  if (!uniqueId || !vender) return res.sendStatus(422);
  return next();
};

export const isValidUser = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): express.Response | void => {
  const { authorization } = req.headers;
  // 토큰이 없음
  if (!authorization || authorization.split(" ").length < 2)
    return res.sendStatus(403);
  const [type, JWT] = authorization.split(" ");
  // 토큰의 타입이 비정상
  if (type !== "Bearer") return res.sendStatus(403);
  const payload: JwtPayload | null = decryptJwt(JWT);
  // 토큰 자체가 비정상
  if (!payload || Number(payload.userStatus) !== 1) return res.sendStatus(403);

  // 토큰 내용을 저장
  res.locals = payload;
  return next();
};

export const haveParamsToCreateSeat = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): express.Response | void => {
  const {
    leaveAt,
    descriptionGiver,
    cafeName,
    spaceKakaoMapId,
    address,
    geoLocation,
    havePlug,
    thumbnailUrl,
    descriptionSeat,
    // descriptionCloseTime, // optional
  } = req.body;
  if (
    !leaveAt ??
    !descriptionGiver ??
    !cafeName ??
    !spaceKakaoMapId ??
    !address ??
    !geoLocation ??
    !havePlug ??
    !thumbnailUrl ??
    !descriptionSeat
    // descriptionCloseTime: optional
  ) {
    return res.sendStatus(422);
  }
  return next();
};

export const haveParamsToUpdateSeat = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): express.Response | void => {
  const {
    leaveAt,
    descriptionGiver,
    cafeName,
    spaceKakaoMapId,
    address,
    geoLocation,
    havePlug,
    thumbnailUrl,
    descriptionSeat,
    descriptionCloseTime,
  } = req.body;
  if (
    leaveAt === undefined &&
    descriptionGiver === undefined &&
    cafeName === undefined &&
    spaceKakaoMapId === undefined &&
    address === undefined &&
    geoLocation === undefined &&
    havePlug === undefined &&
    thumbnailUrl === undefined &&
    descriptionSeat === undefined &&
    descriptionCloseTime === undefined
  ) {
    return res.sendStatus(422);
  }
  return next();
};
