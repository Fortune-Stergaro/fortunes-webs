
import { defineType, defineField } from 'sanity'

export const viewerType = defineType({
    name: 'viewer',
    title: 'Stream Viewers',
    type: 'document',
    fields: [
        defineField({
            name: 'username',
            title: 'Username',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'lastActive',
            title: 'Last Active Timestamp',
            type: 'datetime', // Crucial for filtering
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'avatar',
            title: 'Avatar Image',
            type: 'image',
            description: 'The image that will generate the "url" property',
            options: {
                hotspot: true, // Allows you to crop/focus the image in the studio
            },
        }),
    ],
    preview: {
        select: {
            title: 'username',
            media: 'avatar',
        },
    },
})

