import { AuthenticationContext, Session, axiosClient } from "../..";
import { CreatePasteRequest, Paste } from "../models";
import { useContext, useEffect, useState } from "react";

import { Axios } from "axios";
import { Controller } from "./Controller";

export function usePasteController() {
  const [session] = useContext(AuthenticationContext);
  const [pasteController, setPasteController] = useState(
    session ? createPasteController(session) : createPasteControllerWithoutAuthentication()
  );

  useEffect(() => {
    if (session) {
      setPasteController(createPasteController(session));
    }
  }, [session]);

  return pasteController;
}

export function usePasteControllerWithoutAuthentication() {
  const [pasteController] = useState(createPasteControllerWithoutAuthentication());
  return pasteController;
}

export function createPasteController(session: Session) {
  return new PasteController(axiosClient, session.accessToken);
}

export function createPasteControllerWithoutAuthentication() {
  return new PasteController(axiosClient);
}

export class PasteController extends Controller {
  constructor(client: Axios, token: string | null = null) {
    super(client, "/api/pastes", token);
  }

  async getPaste(id: string): Promise<Paste> {
    return (await this.client.get(`/${id}`)).data;
  }

  async getPastes(
    limit: number = 10,
    offset: number = 0
  ): Promise<{ pastes: Paste[]; total: number; pages: number }> {
    const response = await this.client.get("", {
      params: {
        limit: limit,
        offset: offset,
      },
    });

    return {
      pastes: response.data,
      total: response.headers["x-total-count"],
      pages: response.headers["x-total-pages"],
    };
  }

  async createPaste(body: CreatePasteRequest): Promise<Paste> {
    return (await this.client.post("", body)).data;
  }

  async deletePaste(id: string) {
    await this.client.delete(`/${id}`);
  }
}
