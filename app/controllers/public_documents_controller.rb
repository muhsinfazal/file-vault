class PublicDocumentsController < ApplicationController
  def show
    doc = Document.find_by!(public_token: params[:token])

    if doc.compressed
      send_data doc.file.blob.download,
                filename: doc.file.filename.to_s,
                type: "application/gzip",
                disposition: "inline"
    else
      redirect_to rails_blob_url(doc.file, disposition: "inline")
    end
  end
end
