import json
from typing import Any, Dict, Optional

from django.core.exceptions import ImproperlyConfigured
from django.utils.translation import gettext_lazy as _
from rest_framework.renderers import JSONRenderer


class GenericJSONRenderer(JSONRenderer):
    charset = "utf-8"
    object_label = "object"

    def render(
        self,
        data: Any,
        accepted_media_type: Optional[str] = None,
        renderer_context: Optional[Dict[str, Any]] = None,
    ) -> bytes:
        renderer_context = renderer_context or {}

        view = renderer_context.get("view")
        object_label = getattr(view, "object_label", self.object_label)

        response = renderer_context.get("response")
        if not response:
            raise ImproperlyConfigured(_("Response not found in renderer context"))

        status_code = response.status_code

        if isinstance(data, dict) and "errors" in data:
            return super().render(data)

        if not isinstance(data, dict):
            data = {"data": data}

        response_data = {"status_code": status_code, object_label: data}

        return json.dumps(response_data).encode(self.charset)
