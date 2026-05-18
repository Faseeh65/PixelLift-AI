import { collection, config, fields } from "@keystatic/core";

type PreviewProps = {
  value?: unknown;
};

function formatTagLabel(props: PreviewProps): string {
  if (typeof props.value === "string" && props.value.trim().length > 0) {
    return props.value;
  }

  return "Tag";
}

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    posts: collection({
      label: "Blog Posts",
      slugField: "slug",
      path: "content/blog/*",
      format: {
        contentField: "content",
      },
      schema: {
        title: fields.text({
          label: "Title",
          validation: { isRequired: true },
        }),
        slug: fields.text({
          label: "Slug",
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: "Description",
          validation: { isRequired: true },
          multiline: true,
        }),
        date: fields.date({
          label: "Published Date",
          validation: { isRequired: true },
        }),
        author: fields.text({
          label: "Author",
          defaultValue: "PixelLift AI Team",
        }),
        category: fields.text({
          label: "Category",
          defaultValue: "AI Image Enhancement",
        }),
        tags: fields.array(
          fields.text({
            label: "Tag",
          }),
          {
            label: "Tags",
            itemLabel: formatTagLabel,
          }
        ),
        coverImage: fields.text({
          label: "Cover Image",
          defaultValue: "",
        }),
        content: fields.markdoc({
          label: "Content",
          extension: "md",
        }),
      },
    }),
  },
});
