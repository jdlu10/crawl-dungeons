module JsonErrorHandler
  extend ActiveSupport::Concern

  # Render a JSON error response with given message(s) and HTTP status
  #
  # @param message [String, Array<String>, Hash] the error message(s)
  # @param status [Symbol, Integer] HTTP status code or symbol (default: :unprocessable_entity)
  def json_error(message, status = :unprocessable_entity)
    error_payload = case message
                    when String
                      { error: message }
                    when Array
                      { errors: message }
                    when Hash
                      message
                    else
                      { error: message.to_s }
                    end

    render json: error_payload, status: status
  end
end