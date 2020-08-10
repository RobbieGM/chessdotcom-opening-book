module.exports = {
  purge: ["./src/book-editor/**/*.tsx"],
  theme: {
    extend: {
      gridTemplateColumns: {
        "12rem": "repeat(auto-fill, 12rem)",
      },
      spacing: {
        "max-content": "max-content",
      },
    },
  },
  variants: ["responsive", "hover", "focus", "active", "first"],
  plugins: [],
};
