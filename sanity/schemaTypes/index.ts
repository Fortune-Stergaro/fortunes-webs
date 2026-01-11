import { type SchemaTypeDefinition } from 'sanity'
import {viewerType} from "@/streamIntergration/sanity/streamSchemaTypes/viewers";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
      viewerType
  ],
}
