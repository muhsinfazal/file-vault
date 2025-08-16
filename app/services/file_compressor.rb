class FileCompressor
  TEXT_MIME_TYPES = %w[
    application/json
    application/xml
    application/x-ndjson
  ].freeze

  def self.compress_if_needed(uploaded_file, detected_type)
    is_text_like = detected_type&.start_with?("text/") || TEXT_MIME_TYPES.include?(detected_type)

    if is_text_like
      tempfile = Tempfile.new([uploaded_file.original_filename, ".gz"], binmode: true)

      Zlib::GzipWriter.open(tempfile, Zlib::BEST_COMPRESSION) do |gz|
        gz.write uploaded_file.read
      end

      tempfile.rewind
      {
        io: tempfile,
        filename: "#{uploaded_file.original_filename}.gz",
        content_type: "application/gzip",
        compressed: true
      }
    else
      {
        io: uploaded_file,
        filename: uploaded_file.original_filename,
        content_type: detected_type,
        compressed: false
      }
    end
  end
end
