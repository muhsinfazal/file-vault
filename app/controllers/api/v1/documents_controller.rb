class Api::V1::DocumentsController < ApplicationController
  before_action :authenticate_user!
  before_action :load_document!, only: %i[destroy share]

  def index
    documents = current_user.documents.order(created_at: :desc).map do |doc|
      {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        content_type: doc.content_type,
        byte_size: doc.byte_size,
        compressed: doc.compressed,
        created_at: doc.created_at,
        public_url: public_document_url(doc.public_token)
      }
    end
    
    render json: { documents: }
  end

  def create
    unless params[:file].present?
      return render json: { error: "File is required!" }, status: :unprocessable_entity
    end

    title = params[:title].presence || params[:file].original_filename
    description = params[:description].to_s

    uploaded_file = params[:file]
    detected_type = Marcel::MimeType.for uploaded_file, name: uploaded_file.original_filename
    is_text_like = detected_type&.start_with?("text/") || %w[
      application/json application/xml application/x-ndjson
    ].include?(detected_type)

    doc = current_user.documents.build(
      title:,
      description:,
      content_type: detected_type
    )

    if is_text_like
      tempfile = Tempfile.new([uploaded_file.original_filename, ".gz"], binmode: true)

      gz = Zlib::GzipWriter.new(tempfile, Zlib::BEST_COMPRESSION)
      gz.write uploaded_file.read
      gz.finish
      tempfile.rewind
      
      filename = "#{uploaded_file.original_filename}.gz"
      doc.file.attach(io: tempfile, filename:, content_type: "application/gzip")
      doc.byte_size = doc.file.blob.byte_size
      doc.compressed = true
    else
      doc.file.attach(uploaded_file)
      doc.byte_size = doc.file.blob.byte_size
      doc.compressed = false
    end

    if doc.save
      render json: {
        document: {
          id: doc.id,
          title: doc.title,
          description: doc.description,
          content_type: doc.content_type,
          byte_size: doc.byte_size,
          compressed: doc.compressed,
          public_url: public_document_url(doc.public_token)
        }
      }, status: :created
    else
      render json: { errors: doc.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @document.destroy!

    head :no_content
  end

  def share
    @document.update!(public_token: SecureRandom.urlsafe_base64(10))

    render json: { public_url: public_document_url(@document.public_token) }
  end

  private

  def load_document!
    @document = current_user.documents.find(params[:id])
  end
end
