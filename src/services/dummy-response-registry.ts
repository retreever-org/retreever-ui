import type { ResponseViewMode } from "../types/editor.types";
import JsonResponse from "../util/dummyResponse.json";
import XmlResponse from "../util/dummyXMLResponse.json";
import HtmlResponse from "../util/dummyHTMLResponse.json";

export const getDummyResponse = (viewMode: ResponseViewMode) => {
  switch (viewMode) {
    case "json":
      return JsonResponse;
    case "xml":
      return XmlResponse;
    case "html":
      return HtmlResponse;
    default:
      return null;
  }
}