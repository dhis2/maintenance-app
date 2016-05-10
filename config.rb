require "normalize-scss"
require "compass"
require "breakpoint"
require "susy"
require "support-for"

css_dir = "src/css"
sass_dir = "scss"

class CSSImporter < Sass::Importers::Filesystem
  def extensions
    super.merge('css' => :scss)
  end
end
sass_options = {:filesystem_importer => CSSImporter}
